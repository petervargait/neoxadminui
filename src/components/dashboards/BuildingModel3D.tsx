'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TOTAL_FLOORS = 25
const BASEMENT_COUNT = 3

function getFloorName(index: number): string {
  if (index < BASEMENT_COUNT) {
    return 'B' + (BASEMENT_COUNT - index)
  }
  return 'Floor ' + (index - BASEMENT_COUNT)
}

// DASH colour palette
const DASH = {
  pageBg: '#08122E',
  cardBg: '#0F1A2E',
  cardBg2: '#162032',
  cardBorder: '#1E3A5F',
  text: '#F1F5F9',
  label: '#94A3B8',
  muted: '#64748B',
  gold: '#C9963B',
  blue: '#3B82F6',
  green: '#10B981',
  cyan: '#06B6D4',
} as const

// Floor occupancy % = current / hse capacity (matching Dashboard7 FLOOR_DATA)
const FLOOR_OCCUPANCY_PCT: Record<number, number> = {
  0: 0, 1: 0, 2: 0,       // Basements B3, B2, B1
  3: 32,   // Floor 0 - Ground 95/300
  4: 36,   // Floor 1 - Cafeteria 72/200
  5: 25,   // Floor 2 - Fitness 38/150
  6: 45,   // Floor 3 - Conference 112/250
  7: 28,   // Floor 4 - Office 78/280
  8: 30,   // Floor 5 - 85/280
  9: 26,   // Floor 6 - 74/280
  10: 33,  // Floor 7 - 92/280
  11: 31,  // Floor 8 - 88/280
  12: 23,  // Floor 9 - 65/280
  13: 19,  // Floor 10 - 52/280
  14: 12,  // Floor 11 - 34/280
  15: 15,  // Floor 12 - 41/280
  16: 24,  // Floor 13 - 68/280
  17: 20,  // Floor 14 - 55/280
  18: 22,  // Floor 15 - 62/280
  19: 21,  // Floor 16 - 58/280
  20: 17,  // Floor 17 - 42/250
  21: 11,  // Floor 18 - 28/250
  22: 15,  // Floor 19 - Executive 18/120
  23: 15,  // Floor 20 - 12/80
  24: 8,   // Floor 21 - Rooftop 8/100
}

function getFloorHighlightColor(floorIndex: number): number {
  const pct = FLOOR_OCCUPANCY_PCT[floorIndex] ?? 50
  if (pct >= 80) return 0xEF4444  // Red
  if (pct >= 50) return 0xF59E0B  // Amber
  return 0x10B981                  // Green
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface BuildingModel3DProps {
  onFloorSelect?: (floorIndex: number, floorName: string) => void
  height?: number
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const BuildingModel3D: React.FC<BuildingModel3DProps> = ({ onFloorSelect, height }) => {
  // ---- state ---------------------------------------------------------------
  const [mode, setMode] = useState<'shaded' | 'ghost'>('ghost')
  const [loading, setLoading] = useState(true)
  const [hoveredFloor, setHoveredFloor] = useState<string>('')

  // ---- refs ----------------------------------------------------------------
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  const modelRef = useRef<THREE.Group | null>(null)
  const wireframeGroupRef = useRef<THREE.Group | null>(null)
  const highlightGroupRef = useRef<THREE.Group | null>(null)

  const originalMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map())
  const floorHeightRef = useRef<number>(1)
  const modelMinYRef = useRef<number>(0)
  const currentFloorRef = useRef<number>(-1)

  const clipBottomRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const clipTopRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, -1, 0), 0))

  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())

  const animationIdRef = useRef<number>(0)
  const modeRef = useRef<'shaded' | 'ghost'>(mode)
  const envTextureRef = useRef<THREE.Texture | null>(null)

  // Keep modeRef in sync with mode state so event handlers see latest value
  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  // ---- applyMode -----------------------------------------------------------
  const applyMode = useCallback(() => {
    const scene = sceneRef.current
    const model = modelRef.current
    const wireframeGroup = wireframeGroupRef.current
    if (!scene || !model) return

    const ambientLight = scene.children.find(
      (c): c is THREE.AmbientLight => c instanceof THREE.AmbientLight,
    )
    const dirLights = scene.children.filter(
      (c): c is THREE.DirectionalLight => c instanceof THREE.DirectionalLight,
    )

    if (modeRef.current === 'shaded') {
      // Restore original materials
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          const orig = originalMaterialsRef.current.get(mesh)
          if (orig) mesh.material = orig
        }
      })
      scene.environment = envTextureRef.current
      scene.background = new THREE.Color(0x2a2a3a)
      if (wireframeGroup) wireframeGroup.visible = false
      if (ambientLight) ambientLight.intensity = 0.6
      if (dirLights[0]) dirLights[0].intensity = 1.8
      if (dirLights[1]) dirLights[1].intensity = 0.5
    } else {
      // Ghost mode – blue translucent
      const ghostMat = new THREE.MeshPhongMaterial({
        color: 0x3399dd,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.material = ghostMat
        }
      })
      scene.environment = null
      scene.background = new THREE.Color(0x0e1525)
      if (wireframeGroup) {
        wireframeGroup.visible = true
        wireframeGroup.traverse((child) => {
          if ((child as THREE.LineSegments).isLineSegments) {
            const line = child as THREE.LineSegments
            ;(line.material as THREE.LineBasicMaterial).color.set(0x2266aa)
            ;(line.material as THREE.LineBasicMaterial).opacity = 0.25
          }
        })
      }
      if (ambientLight) ambientLight.intensity = 0.5
      if (dirLights[0]) dirLights[0].intensity = 1.2
      if (dirLights[1]) dirLights[1].intensity = 0.4
    }
  }, [])

  // When mode changes, re-apply
  useEffect(() => {
    applyMode()
  }, [mode, applyMode])

  // ---- main setup effect ---------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = containerRef.current
    if (!container) return

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.localClippingEnabled = true
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // --- Scene ---
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0e1525)
    sceneRef.current = scene

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.01,
      1000,
    )
    cameraRef.current = camera

    // --- Controls ---
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controlsRef.current = controls

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight.position.set(5, 10, 7)
    scene.add(dirLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4)
    fillLight.position.set(-5, 2, -5)
    scene.add(fillLight)

    // --- Environment ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture
    envTextureRef.current = envTexture
    pmremGenerator.dispose()

    // --- Clipping planes ---
    const clipBottom = clipBottomRef.current
    const clipTop = clipTopRef.current

    // --- Floor highlight material (color updated dynamically per floor) ---
    const floorHighlightMat = new THREE.MeshBasicMaterial({
      color: 0x10B981,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      side: THREE.DoubleSide,
      clippingPlanes: [clipBottom, clipTop],
    })
    const floorHighlightMatRef = { current: floorHighlightMat }

    // --- Load model ---
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)

    gltfLoader.load('/models/MHBCompressed.glb', (gltf) => {
      const model = gltf.scene
      scene.add(model)
      modelRef.current = model

      // Store original materials
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          originalMaterialsRef.current.set(
            mesh,
            Array.isArray(mesh.material) ? [...mesh.material] : mesh.material,
          )
        }
      })

      // Build wireframe group
      const wireframeGroup = new THREE.Group()
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          const edges = new THREE.EdgesGeometry(mesh.geometry)
          const lineMat = new THREE.LineBasicMaterial({
            color: 0x2266aa,
            transparent: true,
            opacity: 0.25,
          })
          const lineSegments = new THREE.LineSegments(edges, lineMat)
          lineSegments.position.copy(mesh.getWorldPosition(new THREE.Vector3()))
          lineSegments.rotation.copy(mesh.getWorldQuaternion(new THREE.Quaternion()).toJSON() as unknown as THREE.Euler)
          mesh.getWorldQuaternion(lineSegments.quaternion)
          lineSegments.scale.copy(mesh.getWorldScale(new THREE.Vector3()))
          wireframeGroup.add(lineSegments)
        }
      })
      scene.add(wireframeGroup)
      wireframeGroupRef.current = wireframeGroup

      // Build highlight group
      const highlightGroup = new THREE.Group()
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          const clone = mesh.clone()
          clone.material = floorHighlightMat
          clone.position.copy(mesh.getWorldPosition(new THREE.Vector3()))
          mesh.getWorldQuaternion(clone.quaternion)
          clone.scale.copy(mesh.getWorldScale(new THREE.Vector3()))
          highlightGroup.add(clone)
        }
      })
      highlightGroup.visible = false
      scene.add(highlightGroup)
      highlightGroupRef.current = highlightGroup

      // Fit camera
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)

      camera.position.set(
        center.x + maxDim * 0.6,
        center.y + maxDim * 0.4,
        center.z + maxDim * 0.6,
      )
      controls.target.copy(center)
      controls.update()

      // Floor metrics
      const modelHeight = size.y
      floorHeightRef.current = modelHeight / TOTAL_FLOORS
      modelMinYRef.current = box.min.y

      setLoading(false)
      applyMode()
    })

    // --- Animation loop ---
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // --- Resize observer ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height: h } = entry.contentRect
        if (width === 0 || h === 0) continue
        camera.aspect = width / h
        camera.updateProjectionMatrix()
        renderer.setSize(width, h)
      }
    })
    resizeObserver.observe(container)

    // --- Mouse events ---
    const onMouseMove = (event: MouseEvent) => {
      if (modeRef.current !== 'ghost') {
        setHoveredFloor('')
        if (highlightGroupRef.current) highlightGroupRef.current.visible = false
        return
      }
      if (!containerRef.current || !cameraRef.current || !modelRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      mouseRef.current.x = (x / rect.width) * 2 - 1
      mouseRef.current.y = -(y / rect.height) * 2 + 1

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
      const intersects = raycasterRef.current.intersectObject(modelRef.current, true)

      if (intersects.length > 0) {
        const hitY = intersects[0].point.y
        const floorIndex = Math.floor((hitY - modelMinYRef.current) / floorHeightRef.current)
        const clampedFloor = Math.max(0, Math.min(floorIndex, TOTAL_FLOORS - 1))

        const floorMinY = modelMinYRef.current + clampedFloor * floorHeightRef.current
        const floorMaxY = floorMinY + floorHeightRef.current

        clipBottomRef.current.constant = -floorMinY
        clipTopRef.current.constant = floorMaxY

        // Update highlight color based on floor occupancy (RAG)
        floorHighlightMatRef.current.color.set(getFloorHighlightColor(clampedFloor))

        if (highlightGroupRef.current) highlightGroupRef.current.visible = true
        currentFloorRef.current = clampedFloor

        const pct = FLOOR_OCCUPANCY_PCT[clampedFloor] ?? 0
        const floorName = getFloorName(clampedFloor)
        setHoveredFloor(`${floorName} — ${pct}% occupied`)

        // Position tooltip
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${x + 14}px`
          tooltipRef.current.style.top = `${y - 10}px`
        }
      } else {
        if (highlightGroupRef.current) highlightGroupRef.current.visible = false
        setHoveredFloor('')
      }
    }

    const onClick = (event: MouseEvent) => {
      if (modeRef.current !== 'ghost') return
      if (!containerRef.current || !cameraRef.current || !modelRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      mouseRef.current.x = (x / rect.width) * 2 - 1
      mouseRef.current.y = -(y / rect.height) * 2 + 1

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
      const intersects = raycasterRef.current.intersectObject(modelRef.current, true)

      if (intersects.length > 0) {
        const hitY = intersects[0].point.y
        const floorIndex = Math.floor((hitY - modelMinYRef.current) / floorHeightRef.current)
        const clampedFloor = Math.max(0, Math.min(floorIndex, TOTAL_FLOORS - 1))

        const floorNum = clampedFloor - BASEMENT_COUNT
        if (floorNum >= 0) {
          onFloorSelect?.(floorNum, getFloorName(clampedFloor))
        }
      }
    }

    const onMouseLeave = () => {
      if (highlightGroupRef.current) highlightGroupRef.current.visible = false
      setHoveredFloor('')
    }

    const canvasEl = renderer.domElement
    canvasEl.addEventListener('mousemove', onMouseMove)
    canvasEl.addEventListener('click', onClick)
    canvasEl.addEventListener('mouseleave', onMouseLeave)

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationIdRef.current)
      canvasEl.removeEventListener('mousemove', onMouseMove)
      canvasEl.removeEventListener('click', onClick)
      canvasEl.removeEventListener('mouseleave', onMouseLeave)
      resizeObserver.disconnect()
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- render --------------------------------------------------------------
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Mode toggle toolbar */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          display: 'flex',
          gap: 8,
        }}
      >
        {(['shaded', 'ghost'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: mode === m ? DASH.cardBorder : 'rgba(15,26,46,0.8)',
              border: `1px solid ${mode === m ? DASH.blue : DASH.cardBorder}`,
              color: mode === m ? DASH.text : DASH.label,
              backdropFilter: 'blur(8px)',
            }}
          >
            {m === 'shaded' ? 'S \u2014 Shaded' : 'G \u2014 Ghost'}
          </button>
        ))}
      </div>

      {/* Loading spinner */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(8,18,46,0.8)',
            zIndex: 5,
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              color: DASH.label,
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Loading 3D Model...
          </div>
        </div>
      )}

      {/* Floor tooltip */}
      {hoveredFloor && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 20,
            background: 'rgba(10,20,40,0.85)',
            color: '#44eebb',
            fontSize: '13px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '4px',
            border: '1px solid rgba(68,238,187,0.3)',
          }}
        >
          {hoveredFloor}
        </div>
      )}

      {/* 3D Canvas container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: height || 500,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#0e1525',
        }}
      />

      {/* Controls hint */}
      <div
        style={{
          textAlign: 'center',
          padding: '8px 0',
          fontSize: '11px',
          color: DASH.muted,
        }}
      >
        Drag to rotate &middot; Scroll to zoom &middot; Right-click to pan
        {mode === 'ghost' ? ' \u00B7 Click floor to view floorplan' : ''}
      </div>
    </div>
  )
}

export default BuildingModel3D
