'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NeoxLogo from '../../components/NeoxLogo'
import { AlertRegular, StatusRegular, DocumentBulletListRegular, MailRegular, AlertOnRegular, DeleteRegular, ArrowUploadRegular, AddRegular, ArrowDownloadRegular, PeopleRegular, DocumentRegular, BuildingRegular, SettingsRegular, ErrorCircleRegular, WarningRegular, InfoRegular, CheckmarkCircleRegular } from '@fluentui/react-icons'
import { useGlobalState } from '../../context/GlobalStateContext'
import ColorPicker, { ColorConfig } from '../../components/ColorPicker'
import FontFamilySelector, { FontFamily } from '../../components/FontFamilySelector'
import VisitorDashboard from '../../components/VisitorDashboard'
import ParkingDashboard from '../../components/ParkingDashboard'
import LockerDashboard from '../../components/LockerDashboard'
import BadgesDashboard from '../../components/BadgesDashboard'
import DashboardFilters from '../../components/DashboardFilters'

export default function AdminPage() {
  const router = useRouter()
  const globalState = useGlobalState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated')
    const storedUsername = sessionStorage.getItem('username') || ''
    
    if (authStatus !== 'true') {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
      setUsername(storedUsername)
    }
  }, [router])

  const [activeSection, setActiveSection] = useState<string>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<string>('all')
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<{name: string; email: string; role: string; department: string; status: string; profileId?: string} | null>(null)
  const [createBadgeForUser, setCreateBadgeForUser] = useState(false)
  const [userSortField, setUserSortField] = useState<'name' | 'email' | 'role' | 'department' | 'status'>('name')
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc')
  const [expandedUserRow, setExpandedUserRow] = useState<number | null>(null)

  // Note: Policy files are now managed via global state (globalState.policyFiles)

  // Note: Digital badges are now managed via global state (globalState.badges)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [editingBadge, setEditingBadge] = useState<{id?: number; name: string; email: string; company: string; cardType: string; imei: string} | null>(null)
  const [badgeSearchTerm, setBadgeSearchTerm] = useState('')
  const [badgeStatusFilter, setBadgeStatusFilter] = useState('All Statuses')
  const [badgeCardTypeFilter, setBadgeCardTypeFilter] = useState('All Card Types')
  const [showBadgeImportModal, setShowBadgeImportModal] = useState(false)
  
  // Parking state
  const [showParkingModal, setShowParkingModal] = useState(false)
  const [editingParkingSpace, setEditingParkingSpace] = useState<{
    id?: string
    spaceNumber: string
    name: string
    building: string
    location: string
    level: string
    floor: string
    isElectric: boolean
    isDisabled: boolean
    isSpecialNeed: boolean
    isVIP: boolean
    isReservedForVisitor: boolean
    notes: string
  } | null>(null)
  
  // Locker state
  const [showLockerModal, setShowLockerModal] = useState(false)
  const [editingLocker, setEditingLocker] = useState<{
    id?: string
    lockerNumber: string
    name: string
    building: string
    floor: string
    zone: string
    type: 'permanent' | 'gym' | 'bike' | 'temporary' | 'storage'
    notes: string
  } | null>(null)
  
  // Space state
  const [showSpaceModal, setShowSpaceModal] = useState(false)
  const [editingSpace, setEditingSpace] = useState<{
    id?: string
    spaceNumber: string
    name: string
    building: string
    floor: string
    location: string
    zone: string
    type: 'desk' | 'office' | 'meeting-room' | 'conference-room' | 'social-hub'
    capacity: number
    notes: string
  } | null>(null)
  
  // Building state
  const [showBuildingModal, setShowBuildingModal] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState<{
    id?: string
    name: string
    basementLevels: number
    topFloor: number
  } | null>(null)
  const [selectedFloorForZones, setSelectedFloorForZones] = useState<number | null>(null)
  
  // Building selection state for modals
  const [selectedParkingBuilding, setSelectedParkingBuilding] = useState<string>('')
  const [selectedLockerBuilding, setSelectedLockerBuilding] = useState<string>('')
  const [selectedSpaceBuilding, setSelectedSpaceBuilding] = useState<string>('')
  
  // White label state
  const [whiteLabelForm, setWhiteLabelForm] = useState<{
    companyName: string;
    logoData: string;
    primaryColor: ColorConfig;
    secondaryColor: ColorConfig;
    fontFamily: FontFamily;
  }>({
    companyName: '',
    logoData: '',
    primaryColor: { type: 'solid', solid: { color: '#d7bb91', alpha: 100 } },
    secondaryColor: { type: 'solid', solid: { color: '#3b82f6', alpha: 100 } },
    fontFamily: {
      id: 'roboto',
      name: 'Roboto',
      category: 'google',
      fallback: 'Roboto, sans-serif',
      weights: [100, 300, 400, 500, 700, 900],
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    }
  })
  
  // System Settings state
  const [systemSettingsForm, setSystemSettingsForm] = useState({
    emailNotifications: true,
    autoApproveInvitations: true,
    maintenanceMode: false,
    sessionTimeout: 30,
    require2FA: true,
    backgroundImageData: '',
    workflowManagementEnabled: false
  })
  
  // Integrations state
  const [moduleIntegrations, setModuleIntegrations] = useState<Record<string, string>>({
    'User Management': 'NEOX',
    'Visitor Management': 'NEOX',
    'Parking': 'NEOX',
    'Emergency': 'NEOX',
    'Restaurant': 'Delirest',
    'Ticketing': 'NEOX',
    'Service Hub': 'Life1',
    'Lockers': 'Vecos',
    'Space Management': 'NEOX'
  })

  // Dashboard filter state
  const [dashboardStartDate, setDashboardStartDate] = useState('')
  const [dashboardEndDate, setDashboardEndDate] = useState('')

  // Export dashboard data to CSV
  const exportToCSV = () => {
    if (selectedTenant === 'all') return
    
    const tenant = globalState.tenants.find(t => t.id === selectedTenant)
    if (!tenant) return

    // Prompt user for filename
    const defaultFilename = `${tenant.name}_dashboard_${new Date().toISOString().split('T')[0]}`
    const filename = window.prompt('Enter filename for CSV export:', defaultFilename)
    
    // User cancelled the prompt
    if (filename === null) return
    
    // Use provided filename or default if empty
    const finalFilename = filename.trim() || defaultFilename

    let csvContent = ''
    
    // Export Visitor Management data
    if (tenant.modules.includes('Visitor Management')) {
      const invitations = globalState.invitations.filter(inv => {
        const host = globalState.users.find(u => u.id === inv.hostId)
        return host?.tenantId === selectedTenant
      })
      csvContent += 'Visitor Management\n'
      csvContent += 'Name,Email,Host,Date,Time,Purpose,Status\n'
      invitations.forEach(inv => {
        const host = globalState.users.find(u => u.id === inv.hostId)
        csvContent += `"${inv.visitorName}","${inv.visitorEmail}","${host?.name || ''}","${inv.visitDate}","${inv.visitTime}","${inv.purpose}","${inv.status}"\n`
      })
      csvContent += '\n'
    }

    // Export Parking data
    if (tenant.modules.includes('Parking')) {
      const parkingSpaces = globalState.parkingSpaces.filter(s => s.tenantId === selectedTenant)
      const bookings = globalState.parkingBookings?.filter(b => b.tenantId === selectedTenant) || []
      csvContent += 'Parking Spaces\n'
      csvContent += 'Space Number,Name,Building,Status\n'
      parkingSpaces.forEach(space => {
        csvContent += `"${space.spaceNumber}","${space.name}","${space.building}","${space.status}"\n`
      })
      csvContent += '\nParking Bookings\n'
      csvContent += 'Space,User,Date,Status\n'
      bookings.forEach(b => {
        csvContent += `"${b.spaceNumber}","${b.userName}","${b.bookingDate}","${b.status}"\n`
      })
      csvContent += '\n'
    }

    // Export Locker data
    if (tenant.modules.includes('Lockers')) {
      const lockers = globalState.lockers.filter(l => l.tenantId === selectedTenant)
      csvContent += 'Lockers\n'
      csvContent += 'Locker Number,Name,Building,Floor,Status\n'
      lockers.forEach(locker => {
        csvContent += `"${locker.lockerNumber}","${locker.name}","${locker.building}","${locker.floor}","${locker.status}"\n`
      })
      csvContent += '\n'
    }

    // Export Badge data
    const badges = globalState.badges.filter(badge => {
      const user = globalState.users.find(u => u.email === badge.email || u.id === badge.userId)
      return user?.tenantId === selectedTenant
    })
    if (badges.length > 0) {
      csvContent += 'Digital Badges\n'
      csvContent += 'Name,Email,Company,Status\n'
      badges.forEach(badge => {
        csvContent += `"${badge.name}","${badge.email}","${badge.company}","${badge.status}"\n`
      })
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${finalFilename}.csv`
    link.click()
  }

  // Export dashboard data to XLS (HTML table format)
  const exportToXLS = () => {
    if (selectedTenant === 'all') return
    
    const tenant = globalState.tenants.find(t => t.id === selectedTenant)
    if (!tenant) return

    // Prompt user for filename
    const defaultFilename = `${tenant.name}_dashboard_${new Date().toISOString().split('T')[0]}`
    const filename = window.prompt('Enter filename for Excel export:', defaultFilename)
    
    // User cancelled the prompt
    if (filename === null) return
    
    // Use provided filename or default if empty
    const finalFilename = filename.trim() || defaultFilename

    let xlsContent = '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"><xml><x:ExcelWorkbook><x:ExcelWorksheets>'
    
    // Export Visitor Management data
    if (tenant.modules.includes('Visitor Management')) {
      xlsContent += `<x:ExcelWorksheet><x:Name>Visitors</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>`
    }

    xlsContent += '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>'
    
    // Add tables
    if (tenant.modules.includes('Visitor Management')) {
      const invitations = globalState.invitations.filter(inv => {
        const host = globalState.users.find(u => u.id === inv.hostId)
        return host?.tenantId === selectedTenant
      })
      xlsContent += '<table border="1"><caption>Visitor Management</caption><tr><th>Name</th><th>Email</th><th>Host</th><th>Date</th><th>Time</th><th>Purpose</th><th>Status</th></tr>'
      invitations.forEach(inv => {
        const host = globalState.users.find(u => u.id === inv.hostId)
        xlsContent += `<tr><td>${inv.visitorName}</td><td>${inv.visitorEmail}</td><td>${host?.name || ''}</td><td>${inv.visitDate}</td><td>${inv.visitTime}</td><td>${inv.purpose}</td><td>${inv.status}</td></tr>`
      })
      xlsContent += '</table><br/>'
    }

    if (tenant.modules.includes('Parking')) {
      const parkingSpaces = globalState.parkingSpaces.filter(s => s.tenantId === selectedTenant)
      xlsContent += '<table border="1"><caption>Parking Spaces</caption><tr><th>Space Number</th><th>Name</th><th>Building</th><th>Status</th></tr>'
      parkingSpaces.forEach(space => {
        xlsContent += `<tr><td>${space.spaceNumber}</td><td>${space.name}</td><td>${space.building}</td><td>${space.status}</td></tr>`
      })
      xlsContent += '</table><br/>'
    }

    xlsContent += '</body></html>'

    // Download XLS
    const blob = new Blob([xlsContent], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${finalFilename}.xls`
    link.click()
  }

  // Load white label settings when tenant changes
  useEffect(() => {
    if (selectedTenant !== 'all' && globalState?.getWhiteLabel) {
      const existingSettings = globalState.getWhiteLabel(selectedTenant)
      if (existingSettings) {
        // Support both old format (string colors) and new format (ColorConfig)
        setWhiteLabelForm({
          companyName: existingSettings.companyName,
          logoData: existingSettings.logoData || '',
          primaryColor: typeof existingSettings.primaryColor === 'string' 
            ? { type: 'solid', solid: { color: existingSettings.primaryColor, alpha: 100 } }
            : existingSettings.primaryColor || { type: 'solid', solid: { color: '#d7bb91', alpha: 100 } },
          secondaryColor: typeof existingSettings.secondaryColor === 'string'
            ? { type: 'solid', solid: { color: existingSettings.secondaryColor, alpha: 100 } }
            : existingSettings.secondaryColor || { type: 'solid', solid: { color: '#3b82f6', alpha: 100 } },
          fontFamily: existingSettings.fontFamily || {
            id: 'roboto',
            name: 'Roboto',
            category: 'google',
            fallback: 'Roboto, sans-serif',
            weights: [100, 300, 400, 500, 700, 900],
            googleFontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
          }
        })
      } else {
        // Reset to defaults for tenants without settings
        setWhiteLabelForm({
          companyName: '',
          logoData: '',
          primaryColor: { type: 'solid', solid: { color: '#d7bb91', alpha: 100 } },
          secondaryColor: { type: 'solid', solid: { color: '#3b82f6', alpha: 100 } },
          fontFamily: {
            id: 'roboto',
            name: 'Roboto',
            category: 'google',
            fallback: 'Roboto, sans-serif',
            weights: [100, 300, 400, 500, 700, 900],
            googleFontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
          }
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTenant])

  // Load system settings when tenant changes
  useEffect(() => {
    if (!globalState?.getSystemSettings) return
    const tenantId = selectedTenant === 'all' ? 'global' : selectedTenant
    const existingSettings = globalState.getSystemSettings(tenantId)
    if (existingSettings) {
      setSystemSettingsForm({
        emailNotifications: existingSettings.emailNotifications,
        autoApproveInvitations: existingSettings.autoApproveInvitations,
        maintenanceMode: existingSettings.maintenanceMode,
        sessionTimeout: existingSettings.sessionTimeout,
        require2FA: existingSettings.require2FA,
        backgroundImageData: existingSettings.backgroundImageData || '',
        workflowManagementEnabled: existingSettings.workflowManagementEnabled
      })
    } else {
      // Reset to defaults
      setSystemSettingsForm({
        emailNotifications: true,
        autoApproveInvitations: true,
        maintenanceMode: false,
        sessionTimeout: 30,
        require2FA: true,
        backgroundImageData: '',
        workflowManagementEnabled: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTenant])

  // Note: Profiles are now managed via global state (globalState.profiles)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState<{id?: string; name: string; description: string; modules: string[]} | null>(null)

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        console.log('CSV uploaded:', csv)
        alert(`CSV file "${file.name}" uploaded successfully! Processing ${csv.split('\n').length - 1} users.`)
      }
      reader.readAsText(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const handlePolicyUpload = (policyName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Data = e.target?.result as string
        globalState.uploadPolicy(policyName, {
          name: file.name,
          uploadDate: new Date().toLocaleDateString(),
          fileData: base64Data,
          fileType: file.type
        })
        alert(`${policyName} policy "${file.name}" uploaded successfully!`)
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please select a valid PDF file')
    }
  }

  // Digital Badges handlers
  const handleAddBadgeUser = () => {
    setEditingBadge({ name: '', email: '', company: '', cardType: 'Mifare EV3', imei: '' })
    setShowBadgeModal(true)
  }

  const handleEditBadgeUser = (user: typeof globalState.badges[0]) => {
    setEditingBadge(user)
    setShowBadgeModal(true)
  }

  const handleSaveBadgeUser = () => {
    if (!editingBadge) return
    
    if (!editingBadge.name || !editingBadge.email || !editingBadge.company || !editingBadge.imei) {
      alert('Please fill in all required fields')
      return
    }

    if (editingBadge.id) {
      // Update existing
      const existingBadge = globalState.badges.find(b => b.id === editingBadge.id)
      globalState.updateBadge(editingBadge.id, { 
        name: editingBadge.name, 
        email: editingBadge.email, 
        company: editingBadge.company, 
        cardType: editingBadge.cardType, 
        imei: editingBadge.imei 
      })
      alert('Badge user updated successfully')
    } else {
      // Add new
      globalState.addBadge({ 
        name: editingBadge.name, 
        email: editingBadge.email, 
        company: editingBadge.company, 
        cardType: editingBadge.cardType, 
        imei: editingBadge.imei,
        status: 'New'
      })
      alert('Badge user added successfully')
    }
    
    setShowBadgeModal(false)
    setEditingBadge(null)
  }

  const handleDeleteBadgeUser = (userId: number) => {
    const user = globalState.badges.find(u => u.id === userId)
    if (user && confirm(`Delete badge for ${user.name}? This action cannot be undone.`)) {
      globalState.deleteBadge(userId)
      alert('Badge user deleted successfully')
    }
  }

  const handleSendBadgeEmail = (userId: number) => {
    const user = globalState.badges.find(u => u.id === userId)
    if (user) {
      globalState.updateBadge(userId, { status: 'Sent' })
      alert(`Badge email sent to ${user.email}`)
    }
  }

  const handleSendBadgePush = (userId: number) => {
    const user = globalState.badges.find(u => u.id === userId)
    if (user) {
      globalState.updateBadge(userId, { status: 'Sent' })
      alert(`Push notification sent to ${user.name}`)
    }
  }

  const handleSuspendBadge = (userId: number) => {
    const user = globalState.badges.find(u => u.id === userId)
    if (user && confirm(`Suspend badge for ${user.name}?`)) {
      globalState.updateBadge(userId, { status: 'Suspended' })
      alert('Badge suspended successfully')
    }
  }

  const handleRecoverBadge = (userId: number) => {
    const user = globalState.badges.find(u => u.id === userId)
    if (user && confirm(`Recover badge for ${user.name}?`)) {
      globalState.updateBadge(userId, { status: 'Downloaded' })
      alert('Badge recovered successfully')
    }
  }

  const handleBadgeImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        const lines = csv.split('\n').filter(line => line.trim())
        const headers = lines[0].split(',')
        
        lines.slice(1).forEach((line) => {
          const values = line.split(',')
          globalState.addBadge({
            name: values[0]?.trim() || '',
            email: values[1]?.trim() || '',
            company: values[2]?.trim() || '',
            cardType: values[3]?.trim() || 'NFC',
            imei: values[4]?.trim() || '',
            status: 'New'
          })
        })
        
        alert(`Successfully imported ${lines.length - 1} badge users`)
        setShowBadgeImportModal(false)
      }
      reader.readAsText(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const filteredBadgeUsers = globalState.badges.filter(badge => {
    // Filter by tenant
    if (selectedTenant !== 'all') {
      // Find the user associated with this badge
      const associatedUser = globalState.users.find(u => 
        u.email === badge.email || u.id === badge.userId
      )
      // Only show badges for users in the selected tenant
      if (!associatedUser || associatedUser.tenantId !== selectedTenant) {
        return false
      }
    }
    
    const matchesSearch = badgeSearchTerm === '' || 
      badge.name.toLowerCase().includes(badgeSearchTerm.toLowerCase()) ||
      badge.email.toLowerCase().includes(badgeSearchTerm.toLowerCase())
    const matchesStatus = badgeStatusFilter === 'All Statuses' || badge.status === badgeStatusFilter
    const matchesCardType = badgeCardTypeFilter === 'All Card Types' || badge.cardType === badgeCardTypeFilter
    return matchesSearch && matchesStatus && matchesCardType
  })

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh', 
      backgroundColor: '#0B1426',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Sidebar - same as before */}
      <div style={{
        width: sidebarCollapsed ? '150px' : '280px',
        backgroundColor: '#162032',
        borderRight: '1px solid #1E293B',
        transition: 'width 0.3s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Link href="/" style={{
          padding: '24px 20px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          <NeoxLogo width="128px" height="128px" />
        </Link>

        {!sidebarCollapsed && (
          <div style={{ padding: '20px 20px 10px 20px', borderBottom: '1px solid #1E293B' }}>
            <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Select Tenant</label>
            <select 
              value={selectedTenant}
              onChange={(e) => {
                setSelectedTenant(e.target.value);
                if (e.target.value !== 'all') {
                  setActiveSection('dashboard');
                } else {
                  setActiveSection('dashboard');
                }
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#0B1426',
                border: '1px solid #1E293B',
                borderRadius: '6px',
                color: '#F1F5F9',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Tenants</option>
              {globalState.tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
              ))}
            </select>
          </div>
        )}

        <nav style={{ padding: '20px 0', flex: 1 }}>
          {[
            { icon: '◈', label: 'Dashboard', action: () => setActiveSection('dashboard'), enabled: true, isFluentIcon: false, iconType: null },
            { icon: '✓', label: 'Tasks', action: () => setActiveSection('tasks'), enabled: true, isFluentIcon: false, iconType: null },
            { icon: 'building', label: 'Tenants', action: () => setActiveSection('tenantsList'), enabled: true, isFluentIcon: true, iconType: 'building' },
            { icon: 'people', label: 'Users', action: () => setActiveSection('users'), enabled: selectedTenant !== 'all', isFluentIcon: true, iconType: 'people' },
            { icon: 'settings', label: 'Modules', action: () => setActiveSection('modules'), enabled: true, isFluentIcon: true, iconType: 'settings' },
            { icon: '◨', label: 'Bulk Upload', action: () => setActiveSection('bulkUpload'), enabled: selectedTenant !== 'all', isFluentIcon: false, iconType: null },
            { icon: 'document', label: 'Digital Badges', action: () => setActiveSection('digitalBadges'), enabled: selectedTenant !== 'all', isFluentIcon: true, iconType: 'document' },
            { icon: '◆', label: 'White Label', action: () => setActiveSection('whiteLabel'), enabled: selectedTenant !== 'all', isFluentIcon: false, iconType: null },
            { icon: '◪', label: 'Policies', action: () => setActiveSection('policies'), enabled: true, isFluentIcon: false, iconType: null },
            { icon: '◧', label: 'Parking Management', action: () => setActiveSection('parkingManagement'), enabled: selectedTenant !== 'all', isFluentIcon: false, iconType: null },
            { icon: '◎', label: 'Locker Management', action: () => setActiveSection('lockerManagement'), enabled: selectedTenant !== 'all', isFluentIcon: false, iconType: null },
            { icon: '◩', label: 'Space Management', action: () => setActiveSection('spaceManagement'), enabled: selectedTenant !== 'all', isFluentIcon: false, iconType: null },
            { icon: '◫', label: 'Building Management', action: () => setActiveSection('buildingManagement'), enabled: selectedTenant !== 'all', isFluentIcon: false, iconType: null },
            { icon: 'ticket', label: 'Ticket Management', action: () => setActiveSection('ticketManagement'), enabled: true, isFluentIcon: true, iconType: 'ticket' },
            { icon: 'alert', label: 'Notifications', action: () => setActiveSection('notifications'), enabled: true, isFluentIcon: true, iconType: 'alert' },
            { icon: 'status', label: 'System Status', action: () => setActiveSection('systemStatus'), enabled: true, isFluentIcon: true, iconType: 'status' },
            { icon: '▫', label: 'Audit Logs', action: () => setActiveSection('auditLogs'), enabled: true, isFluentIcon: false, iconType: null },
            { icon: '◦', label: 'System Settings', action: () => setActiveSection('systemSettings'), enabled: true, isFluentIcon: false, iconType: null },
          ].map((item, index) => (
            <div key={index} 
              onClick={item.enabled ? item.action : undefined}
              style={{
                padding: '12px 20px',
                margin: '4px 12px',
                borderRadius: '8px',
                cursor: item.enabled ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: item.enabled ? '#94A3B8' : '#475569',
                fontSize: '14px',
                fontWeight: '500',
                opacity: item.enabled ? 1 : 0.4,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (item.enabled) {
                  const target = e.currentTarget;
                  target.style.backgroundColor = '#1E293B';
                  target.style.color = '#F1F5F9';
                }
              }}
              onMouseLeave={(e) => {
                if (item.enabled) {
                  const target = e.currentTarget;
                  target.style.backgroundColor = 'transparent';
                  target.style.color = '#94A3B8';
                }
              }}
            >
              {item.isFluentIcon ? (
                item.iconType === 'people' ? (
                  <PeopleRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'building' ? (
                  <BuildingRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'settings' ? (
                  <SettingsRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'document' ? (
                  <DocumentRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'alert' ? (
                  <AlertRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'status' ? (
                  <StatusRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : item.iconType === 'ticket' ? (
                  <DocumentBulletListRegular style={{ fontSize: '18px', width: '18px', height: '18px' }} />
                ) : (
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                )
              ) : (
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
              )}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        {/* Back to Home Button */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          color: '#64748B',
          textDecoration: 'none',
          fontSize: '14px',
          borderTop: '1px solid #1E293B',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1E293B'
          e.currentTarget.style.color = '#F1F5F9'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#64748B'
        }}>
          <span style={{ fontSize: '18px' }}>◄</span>
          {!sidebarCollapsed && <span>Back to Home</span>}
        </Link>

        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-12px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#3B82F6',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            zIndex: 10
          }}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{
          height: '70px',
          backgroundColor: '#0B1426',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          <div>
            <h1 style={{ 
              color: '#F1F5F9', 
              fontSize: '24px', 
              fontWeight: '600', 
              margin: 0 
            }}>
              {activeSection === 'dashboard' && selectedTenant !== 'all' && (
                `${globalState.tenants.find(t => t.id === selectedTenant)?.name || selectedTenant} Dashboard`
              )}
              {activeSection === 'dashboard' && selectedTenant === 'all' && 'Global Admin Dashboard'}
              {activeSection === 'tasks' && 'Approval Tasks'}
              {activeSection === 'tenantsList' && 'Tenants Management'}
              {activeSection === 'tenantEdit' && 'Edit Tenant'}
              {activeSection === 'tenantCreate' && 'Create New Tenant'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'modules' && 'Manage Modules'}
              {activeSection === 'bulkUpload' && 'Bulk Upload Users'}
              {activeSection === 'digitalBadges' && 'Digital Badges Management'}
              {activeSection === 'whiteLabel' && 'White Label Settings'}
              {activeSection === 'policies' && 'Policy Management'}
              {activeSection === 'parkingManagement' && 'Parking Management'}
              {activeSection === 'lockerManagement' && 'Locker Management'}
              {activeSection === 'spaceManagement' && 'Space Management'}
              {activeSection === 'buildingManagement' && 'Building Management'}
              {activeSection === 'ticketManagement' && 'Ticket Management'}
              {activeSection === 'notifications' && 'Notifications'}
              {activeSection === 'systemStatus' && 'System Status'}
              {activeSection === 'auditLogs' && 'System Audit Logs'}
              {activeSection === 'analytics' && 'Analytics Dashboard'}
              {activeSection === 'systemSettings' && 'System Settings'}
            </h1>
            <p style={{ 
              color: '#64748B', 
              fontSize: '14px', 
              margin: '4px 0 0 0' 
            }}>
              {activeSection === 'dashboard' && selectedTenant !== 'all' && 'Real-time analytics and insights'}
              {activeSection === 'dashboard' && selectedTenant === 'all' && 'Manage tenants, users, and system operations'}
              {activeSection === 'users' && selectedTenant !== 'all' && `Managing users for ${selectedTenant}`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* System Status Icon */}
            <button
              onClick={() => setActiveSection('systemStatus')}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#334155'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B'
              }}
              title="System Status"
            >
              <StatusRegular style={{ fontSize: '20px', width: '20px', height: '20px', color: '#10B981' }} />
            </button>
            
            {/* Notifications Icon */}
            <button
              onClick={() => setActiveSection('notifications')}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.5), 0 0 25px rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#334155'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.6), 0 0 35px rgba(239, 68, 68, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B'
                e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5), 0 0 25px rgba(239, 68, 68, 0.3)'
              }}
              title="Notifications"
            >
              <AlertOnRegular style={{ fontSize: '20px', width: '20px', height: '20px', color: '#F1F5F9' }} />
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                border: '2px solid #1E293B',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)'
              }}></span>
            </button>

            {/* User Profile */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 12px',
              height: '40px',
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {username.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{username}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: '0 16px',
                height: '40px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#F1F5F9',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EF4444'
                e.currentTarget.style.borderColor = '#EF4444'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B'
                e.currentTarget.style.borderColor = '#334155'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content Area - All sections displayed here based on activeSection */}
        <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
          
          {/* I'll continue this message with the remaining content sections... */}

          {/* Dashboard View */}
          {activeSection === 'dashboard' && (
            <>
              {/* Global Stats - Only show when no specific tenant is selected */}
              {selectedTenant === 'all' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px'
                }}>
                  <div style={{
                    padding: '24px',
                    borderRadius: '12px',
                    backgroundColor: '#162032',
                    border: '1px solid #1E293B',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
                      }}>
                        <span style={{ fontSize: '24px', color: '#A78BFA' }}>◎</span>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>{globalState.tenants.filter(t => t.status === 'active').length}</div>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Active Tenants</h3>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Organizations using the platform</p>
                  </div>

                  <div style={{
                    padding: '24px',
                    borderRadius: '12px',
                    backgroundColor: '#162032',
                    border: '1px solid #1E293B',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
                      }}>
                        <span style={{ fontSize: '24px', color: '#A78BFA' }}>◧</span>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9' }}>{globalState.users.length}</div>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>Total Users</h3>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Across all tenants</p>
                  </div>

                  <div style={{
                    padding: '24px',
                    borderRadius: '12px',
                    backgroundColor: '#162032',
                    border: '1px solid #1E293B',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
                      }}>
                        <span style={{ fontSize: '24px', color: '#A78BFA' }}>◈</span>
                      </div>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#A78BFA' }}>Online</div>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F1F5F9', marginBottom: '4px' }}>System Status</h3>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>All services operational</p>
                  </div>
                </div>
              )}

              {/* Tenant-Specific Dashboards */}
              {selectedTenant !== 'all' && (
                <div style={{ marginBottom: '32px' }}>
                  {/* Unified Dashboard Filters */}
                  <DashboardFilters
                    startDate={dashboardStartDate}
                    endDate={dashboardEndDate}
                    onStartDateChange={setDashboardStartDate}
                    onEndDateChange={setDashboardEndDate}
                    onExportCSV={exportToCSV}
                    onExportXLS={exportToXLS}
                  />

                  {/* Reset Dashboard Data Button */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    padding: '16px 20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>No Dashboard Data?</h4>
                      <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>Reset to load sample data for badges, invitations, parking, and lockers</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Reset dashboard data? This will reload sample data for badges, invitations, parking bookings, and locker usages. Your tenants and users will not be affected.')) {
                          globalState.resetDashboardData()
                          alert('Dashboard data has been reset with sample data!')
                        }
                      }}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Reset Dashboard Data
                    </button>
                  </div>

                  {/* Visitor Management Dashboard */}
                  {globalState.tenants.find(t => t.id === selectedTenant)?.modules.includes('Visitor Management') && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                      borderRadius: '16px',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      padding: '24px',
                      marginBottom: '24px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                    }}>
                      <VisitorDashboard
                        invitations={globalState.invitations.filter(inv => {
                          const host = globalState.users.find(u => u.id === inv.hostId)
                          return host?.tenantId === selectedTenant
                        })}
                        startDate={dashboardStartDate}
                        endDate={dashboardEndDate}
                        searchTerm=""
                      />
                    </div>
                  )}

                  {/* Parking Dashboard */}
                  {globalState.tenants.find(t => t.id === selectedTenant)?.modules.includes('Parking') && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                      borderRadius: '16px',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      padding: '24px',
                      marginBottom: '24px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                    }}>
                      <ParkingDashboard
                        parkingSpaces={globalState.parkingSpaces.filter(space => space.tenantId === selectedTenant)}
                        parkingBookings={globalState.parkingBookings?.filter(b => b.tenantId === selectedTenant)}
                        searchTerm=""
                      />
                    </div>
                  )}

                  {/* Locker Dashboard */}
                  {globalState.tenants.find(t => t.id === selectedTenant)?.modules.includes('Lockers') && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                      borderRadius: '16px',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      padding: '24px',
                      marginBottom: '24px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                    }}>
                      <LockerDashboard
                        lockers={globalState.lockers.filter(locker => locker.tenantId === selectedTenant)}
                        lockerUsages={globalState.lockerUsages?.filter(u => u.tenantId === selectedTenant)}
                        searchTerm=""
                      />
                    </div>
                  )}

                  {/* Digital Badges Dashboard */}
                  {globalState.badges.some(badge => {
                    const user = globalState.users.find(u => u.email === badge.email || u.id === badge.userId)
                    return user?.tenantId === selectedTenant
                  }) && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                      borderRadius: '16px',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      padding: '24px',
                      marginBottom: '24px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                    }}>
                      <BadgesDashboard
                        badges={globalState.badges.filter(badge => {
                          const user = globalState.users.find(u => u.email === badge.email || u.id === badge.userId)
                          return user?.tenantId === selectedTenant
                        })}
                        badgeSwipes={globalState.badgeSwipes?.filter(s => s.tenantId === selectedTenant)}
                        searchTerm=""
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Recent Tenants - Only show when no specific tenant is selected */}
              {selectedTenant === 'all' && (
                <div style={{
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B',
                  overflow: 'hidden',
                  marginBottom: '32px'
                }}>
                  <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Recent Tenants</h2>
                      <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Latest organization registrations</p>
                    </div>
                  <button 
                    onClick={() => { setSelectedTenant('all'); setActiveSection('tenantCreate'); }}
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2563EB'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#3B82F6'}
                  >
                    + Create Tenant
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organization</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Users</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</th>
                        <th style={{ padding: '16px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalState.tenants.slice().reverse().slice(0, 5).map((tenant, index) => {
                        const tenantUsers = globalState.users.filter(u => u.tenantId === tenant.id).length;
                        const logos = ['◎', '◆', '◈', '◧', '■'];
                        const colors = ['#D7BB91', '#60A5FA', '#22C55E', '#A78BFA', '#F59E0B'];
                        return (
                        <tr key={tenant.id} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                backgroundColor: `${colors[index % colors.length]}15`,
                                border: `1px solid ${colors[index % colors.length]}40`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                color: colors[index % colors.length],
                                boxShadow: `0 0 10px ${colors[index % colors.length]}30`
                              }}>
                                {logos[index % logos.length]}
                              </div>
                              <div>
                                <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{tenant.name}</div>
                                <div style={{ color: '#64748B', fontSize: '12px' }}>{tenant.domain}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: tenant.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: tenant.status === 'active' ? '#10B981' : '#EF4444'
                            }}>
                              {tenant.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', color: '#F1F5F9', fontSize: '14px' }}>{tenantUsers}</td>
                          <td style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px' }}>{tenant.modules.length > 10 ? 'Enterprise' : tenant.modules.length > 5 ? 'Professional' : 'Starter'}</td>
                          <td style={{ padding: '16px 24px', color: '#64748B', fontSize: '14px' }}>{new Date(tenant.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button onClick={() => {
                              setSelectedTenant(tenant.id);
                              setActiveSection('dashboard');
                            }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #1E293B',
                              borderRadius: '6px',
                              color: '#64748B',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer'
                            }}>
                              Manage
                            </button>
                          </td>
                        </tr>
                      );})}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </>
          )}

          {/* Tasks Section */}
          {activeSection === 'tasks' && (
            <div>
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #1E293B'
                }}>
                  <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Approval Tasks</h2>
                  <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Review and approve pending changes</p>
                </div>

                <div style={{ padding: '24px' }}>
                  {globalState.tasks.filter(t => t.status === 'pending').length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>No pending tasks</div>
                      <div style={{ fontSize: '14px', marginTop: '8px' }}>All approval requests have been processed</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {globalState.tasks.filter(t => t.status === 'pending').map(task => (
                        <div key={task.id} style={{
                          backgroundColor: '#1E293B',
                          borderRadius: '8px',
                          border: '1px solid #334155',
                          padding: '20px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: task.type === 'create' ? 'rgba(34, 197, 94, 0.1)' : task.type === 'update' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                  color: task.type === 'create' ? '#22C55E' : task.type === 'update' ? '#3B82F6' : '#EF4444'
                                }}>
                                  {task.type.toUpperCase()}
                                </span>
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                  color: '#F59E0B'
                                }}>
                                  {task.entity.toUpperCase()}
                                </span>
                              </div>
                              <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                                {task.type === 'create' && `New ${task.entity}: ${task.entityName}`}
                                {task.type === 'update' && `Update ${task.entity}: ${task.entityName}`}
                                {task.type === 'delete' && `Delete ${task.entity}: ${task.entityName}`}
                              </h3>
                              <div style={{ color: '#64748B', fontSize: '14px' }}>
                                Requested by <span style={{ color: '#94A3B8', fontWeight: '500' }}>{task.requestedByName}</span> • {new Date(task.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#0F1629', borderRadius: '6px' }}>
                            <div style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>Details</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                              {Object.entries(task.data as Record<string, unknown>).slice(0, 6).map(([key, value]) => (
                                <div key={key}>
                                  <div style={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}>{key}</div>
                                  <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{String(value)}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              onClick={() => {
                                globalState.approveTask(task.id, username);
                                alert(`Task approved successfully`);
                              }}
                              style={{
                                flex: 1,
                                padding: '10px 20px',
                                backgroundColor: '#22C55E',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16A34A'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#22C55E'}
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Reason for rejection (optional):');
                                globalState.rejectTask(task.id, username, reason || undefined);
                                alert('Task rejected');
                              }}
                              style={{
                                flex: 1,
                                padding: '10px 20px',
                                backgroundColor: 'transparent',
                                border: '1px solid #EF4444',
                                borderRadius: '6px',
                                color: '#EF4444',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#EF4444';
                                e.currentTarget.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#EF4444';
                              }}
                            >
                              ✗ Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recently Processed Tasks */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #1E293B'
                }}>
                  <h2 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Recently Processed</h2>
                </div>
                <div style={{ padding: '24px' }}>
                  {globalState.tasks.filter(t => t.status !== 'pending').slice(0, 10).map(task => (
                    <div key={task.id} style={{
                      padding: '16px',
                      borderBottom: '1px solid #1E293B',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                          {task.type} {task.entity}: {task.entityName}
                        </div>
                        <div style={{ color: '#64748B', fontSize: '12px' }}>
                          {task.requestedByName} • {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: task.status === 'approved' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: task.status === 'approved' ? '#22C55E' : '#EF4444'
                      }}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* User Management Section */}
          {activeSection === 'users' && selectedTenant !== 'all' && (
            <div style={{
              backgroundColor: '#162032',
              borderRadius: '12px',
              border: '1px solid #1E293B',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>User Management</h2>
                  <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Manage organization users and permissions</p>
                </div>
                <button onClick={() => { setEditingUser(null); setShowUserModal(true); }} style={{
                  backgroundColor: '#60A5FA',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(96, 165, 250, 0.4), 0 0 25px rgba(96, 165, 250, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.6), 0 0 35px rgba(96, 165, 250, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(96, 165, 250, 0.4), 0 0 25px rgba(96, 165, 250, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  + Add User
                </button>
              </div>
              
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
                  <input type="search" placeholder="Search users..." style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} />
                  <select style={{
                    padding: '10px 16px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Receptionist</option>
                    <option>User</option>
                  </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th onClick={() => {
                          if (userSortField === 'name') {
                            setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('name');
                            setUserSortDirection('asc');
                          }
                        }} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                          Name {userSortField === 'name' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => {
                          if (userSortField === 'email') {
                            setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('email');
                            setUserSortDirection('asc');
                          }
                        }} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                          Email {userSortField === 'email' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => {
                          if (userSortField === 'role') {
                            setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('role');
                            setUserSortDirection('asc');
                          }
                        }} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                          Role {userSortField === 'role' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => {
                          if (userSortField === 'department') {
                            setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('department');
                            setUserSortDirection('asc');
                          }
                        }} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                          Department {userSortField === 'department' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => {
                          if (userSortField === 'status') {
                            setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setUserSortField('status');
                            setUserSortDirection('asc');
                          }
                        }} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                          Status {userSortField === 'status' && (userSortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Modules</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalState.users
                        .filter(u => u.tenantId === selectedTenant || u.tenantId === 'globaladmin')
                        .sort((a, b) => {
                        const aVal = (a[userSortField] || '').toString().toLowerCase();
                        const bVal = (b[userSortField] || '').toString().toLowerCase();
                        if (userSortDirection === 'asc') {
                          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                        } else {
                          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
                        }
                      }).map((user, idx) => {
                        const userProfile = globalState.profiles.find(p => p.id === user.profileId);
                        const userModules = userProfile?.modules || [];
                        return (
                        <>
                          <tr key={user.id} style={{ borderBottom: expandedUserRow === idx ? 'none' : '1px solid #1E293B' }}>
                            <td style={{ padding: '16px', color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{user.name}</td>
                            <td style={{ padding: '16px', color: '#94A3B8', fontSize: '14px' }}>{user.email}</td>
                            <td style={{ padding: '16px' }}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: user.role === 'Admin' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'Manager' ? 'rgba(245, 158, 11, 0.1)' : user.role === 'Receptionist' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                color: user.role === 'Admin' ? '#EF4444' : user.role === 'Manager' ? '#F59E0B' : user.role === 'Receptionist' ? '#8B5CF6' : '#3B82F6'
                              }}>
                                {user.role}
                              </span>
                            </td>
                            <td style={{ padding: '16px', color: '#94A3B8', fontSize: '14px' }}>{user.department}</td>
                            <td style={{ padding: '16px' }}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: user.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                color: user.status === 'active' ? '#10B981' : '#64748B'
                              }}>
                                {user.status}
                              </span>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <button 
                                onClick={() => setExpandedUserRow(expandedUserRow === idx ? null : idx)}
                                style={{
                                  backgroundColor: '#3B82F6',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: 'white',
                                  fontSize: '12px',
                                  padding: '6px 12px',
                                  cursor: 'pointer',
                                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.3)';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                {expandedUserRow === idx ? 'Hide' : 'View'} Profile: {userProfile?.name || 'None'}
                              </button>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'right' }}>
                              <button onClick={() => { setEditingUser({ name: user.name, email: user.email, role: user.role, department: user.department, status: user.status, profileId: user.profileId }); setShowUserModal(true); }} style={{
                                backgroundColor: '#60A5FA',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                marginRight: '8px',
                                boxShadow: '0 0 10px rgba(96, 165, 250, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(96, 165, 250, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 10px rgba(96, 165, 250, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}>Edit</button>
                              <button onClick={() => { 
                                if (confirm(`${user.status === 'active' ? 'Deactivate' : 'Reactivate'} ${user.name}?`)) { 
                                  globalState.updateUser(user.id, { status: user.status === 'active' ? 'inactive' : 'active' });
                                  alert(`User ${user.status === 'active' ? 'deactivated' : 'reactivated'} successfully`); 
                                } 
                              }} style={{
                                backgroundColor: user.status === 'active' ? '#F59E0B' : '#10B981',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                marginRight: '8px',
                                boxShadow: user.status === 'active' ? '0 0 10px rgba(245, 158, 11, 0.3)' : '0 0 10px rgba(16, 185, 129, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = user.status === 'active' ? '0 0 15px rgba(245, 158, 11, 0.5)' : '0 0 15px rgba(16, 185, 129, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = user.status === 'active' ? '0 0 10px rgba(245, 158, 11, 0.3)' : '0 0 10px rgba(16, 185, 129, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}>{user.status === 'active' ? 'Deactivate' : 'Reactivate'}</button>
                              <button onClick={() => { 
                                if (confirm(`Delete ${user.name}? This action cannot be undone.`)) { 
                                  globalState.deleteUser(user.id);
                                  alert('User deleted successfully'); 
                                } 
                              }} style={{
                                backgroundColor: '#EF4444',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '12px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}>Delete</button>
                            </td>
                          </tr>
                          {expandedUserRow === idx && userProfile && (
                            <tr key={`${user.id}-profile`} style={{ borderBottom: '1px solid #1E293B' }}>
                              <td colSpan={7} style={{ padding: '16px', backgroundColor: '#0F1629' }}>
                                <div style={{ marginBottom: '12px' }}>
                                  <h4 style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Profile: {userProfile.name}</h4>
                                  <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>{userProfile.description}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                                  {userModules.map((module) => (
                                    <div key={module} style={{
                                      padding: '8px 12px',
                                      backgroundColor: '#1E293B',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      border: '1px solid #10B981'
                                    }}>
                                      <span style={{ color: '#F1F5F9', fontSize: '13px' }}>{module}</span>
                                      <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                        color: '#10B981'
                                      }}>
                                        Enabled
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* Bulk Upload Section */}
          {activeSection === 'bulkUpload' && selectedTenant !== 'all' && (
            <div>
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <h3 style={{ color: '#3b82f6', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>ℹ️</span> CSV Format Requirements
                </h3>
                <p style={{ color: '#F1F5F9', fontSize: '14px', margin: '0 0 12px 0' }}>
                  Your CSV file should include the following columns (in order):
                </p>
                <div style={{ fontFamily: 'monospace', backgroundColor: '#1E293B', padding: '12px', borderRadius: '6px', color: '#F1F5F9', fontSize: '12px' }}>
                  name,email,role,department
                </div>
                <div style={{ marginTop: '12px' }}>
                  <button style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    color: '#fff',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }} onClick={() => {
                    const csvContent = "name,email,role,department\nJohn Smith,john@company.com,user,IT\nJane Doe,jane@company.com,admin,HR\nBob Johnson,bob@company.com,manager,Sales"
                    const blob = new Blob([csvContent], { type: 'text/csv' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'users_template.csv'
                    a.click()
                    window.URL.revokeObjectURL(url)
                  }}>Download Sample CSV</button>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '12px', display: 'block' }}>Upload CSV File</label>
                <div style={{ 
                  border: '2px dashed #475569', 
                  borderRadius: '12px', 
                  padding: '32px', 
                  textAlign: 'center',
                  backgroundColor: '#1E293B'
                }}>
                  <input 
                    type="file" 
                    accept=".csv"
                    onChange={handleCSVUpload}
                    style={{ display: 'none' }}
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" style={{
                    backgroundColor: '#3B82F6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}>Choose CSV File</label>
                  <p style={{ color: '#64748B', marginTop: '12px', fontSize: '14px' }}>
                    Select a CSV file to upload multiple users at once
                  </p>
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                <h3 style={{ color: '#eab308', fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>⚠️</span> Upload Process
                </h3>
                <ul style={{ color: '#F1F5F9', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
                  <li>Users will be validated before creation</li>
                  <li>Duplicate emails will be skipped</li>
                  <li>Invalid entries will be reported</li>
                  <li>Email invitations will be sent automatically</li>
                </ul>
              </div>
            </div>
          )}

          {/* Module Management Section - Context-aware: Global profiles or Tenant-specific profiles */}
          {activeSection === 'modules' && (() => {
            const isGlobalView = selectedTenant === 'all';
            const currentProfiles = isGlobalView 
              ? globalState.profiles.filter(p => p.isGlobal)
              : globalState.profiles.filter(p => p.isGlobal || p.tenantId === selectedTenant);
            
            return (
              <div>
                <div style={{
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B',
                  overflow: 'hidden',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>
                        {isGlobalView ? 'Global Access Profiles' : `Access Profiles: ${selectedTenant}`}
                      </h2>
                      <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>
                        {isGlobalView 
                          ? 'Global profiles inherited by all tenants' 
                          : 'Global profiles (inherited) and tenant-specific profiles'}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingProfile({ name: '', description: '', modules: [] });
                        setShowProfileModal(true);
                      }}
                      style={{
                        backgroundColor: '#60A5FA',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        boxShadow: '0 0 15px rgba(96, 165, 250, 0.4), 0 0 25px rgba(96, 165, 250, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.6), 0 0 35px rgba(96, 165, 250, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(96, 165, 250, 0.4), 0 0 25px rgba(96, 165, 250, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}>
                      + Create {isGlobalView ? 'Global' : 'Tenant'} Profile
                    </button>
                  </div>

                  <div style={{ padding: '24px' }}>
                    {currentProfiles.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                        <p style={{ fontSize: '16px', marginBottom: '8px' }}>No profiles created yet</p>
                        <p style={{ fontSize: '14px' }}>Create a profile to define module access for users</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                        {currentProfiles.map((profile) => (
                          <div key={profile.id} style={{
                            padding: '20px',
                            backgroundColor: '#1E293B',
                            borderRadius: '12px',
                            border: '1px solid #475569',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#3B82F6';
                            e.currentTarget.style.backgroundColor = '#0F1629';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#475569';
                            e.currentTarget.style.backgroundColor = '#1E293B';
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h5 style={{ color: '#F1F5F9', margin: 0, fontSize: '16px', fontWeight: '600' }}>{profile.name}</h5>
                                <span style={{
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                  backgroundColor: profile.isGlobal ? 'rgba(100, 116, 139, 0.2)' : 'rgba(96, 165, 250, 0.2)',
                                  color: profile.isGlobal ? '#64748B' : '#60A5FA'
                                }}>{profile.isGlobal ? 'Global' : 'Tenant'}</span>
                              </div>
                              {!profile.isGlobal && (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button 
                                    onClick={() => {
                                      setEditingProfile({ id: profile.id, name: profile.name, description: profile.description, modules: profile.modules });
                                      setShowProfileModal(true);
                                    }}
                                    style={{
                                      backgroundColor: 'transparent',
                                      border: '1px solid #475569',
                                      borderRadius: '4px',
                                      color: '#3B82F6',
                                      fontSize: '11px',
                                      padding: '4px 8px',
                                      cursor: 'pointer'
                                    }}>Edit</button>
                                  <button 
                                    onClick={() => {
                                      if (confirm(`Delete profile "${profile.name}"? This action cannot be undone.`)) {
                                        globalState.deleteProfile(profile.id);
                                        alert('Profile deleted successfully');
                                      }
                                    }}
                                    style={{
                                      backgroundColor: 'transparent',
                                      border: '1px solid #475569',
                                      borderRadius: '4px',
                                      color: '#EF4444',
                                      fontSize: '11px',
                                      padding: '4px 8px',
                                      cursor: 'pointer'
                                    }}>Delete</button>
                                </div>
                              )}
                            </div>
                            <p style={{ color: '#94A3B8', fontSize: '13px', margin: '0 0 12px 0' }}>{profile.description}</p>
                            
                            <div style={{ marginTop: '12px' }}>
                              <div style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Assigned Modules ({profile.modules.length})</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
                                {profile.modules.map((module) => (
                                  <span key={module} style={{
                                    padding: '4px 10px',
                                    backgroundColor: '#0F1629',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    color: '#10B981',
                                    border: '1px solid rgba(16, 185, 129, 0.3)'
                                  }}>
                                    {module}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Digital Badges Section */}
          {activeSection === 'digitalBadges' && (() => {
            // Filter badges by tenant
            const tenantBadges = selectedTenant === 'all' 
              ? globalState.badges
              : globalState.badges.filter(badge => {
                  const associatedUser = globalState.users.find(u => 
                    u.email === badge.email || u.id === badge.userId
                  )
                  return associatedUser && associatedUser.tenantId === selectedTenant
                })
            
            return (
            <div>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px' }}>{tenantBadges.length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Total Badges Issued</div>
                </div>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#3B82F6', marginBottom: '8px' }}>{tenantBadges.filter(u => u.status === 'Sent').length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Badges Sent</div>
                </div>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981', marginBottom: '8px' }}>{tenantBadges.filter(u => u.status === 'Downloaded').length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Badges Activated</div>
                </div>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: '#162032',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#EF4444', marginBottom: '8px' }}>{tenantBadges.filter(u => u.status === 'Suspended').length}</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Badges Suspended</div>
                </div>
              </div>

              {/* Badge Management Table */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Digital Badge Users</h2>
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Manage and distribute digital wallet badges</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleAddBadgeUser} style={{
                      backgroundColor: '#60A5FA',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(96, 165, 250, 0.4), 0 0 25px rgba(96, 165, 250, 0.2)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.6), 0 0 35px rgba(96, 165, 250, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(96, 165, 250, 0.4), 0 0 25px rgba(96, 165, 250, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                      <AddRegular style={{ fontSize: '16px' }} />
                      Add Badge User
                    </button>
                    <button onClick={() => setShowBadgeImportModal(true)} style={{
                      backgroundColor: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(16, 185, 129, 0.4), 0 0 25px rgba(16, 185, 129, 0.2)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6), 0 0 35px rgba(16, 185, 129, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4), 0 0 25px rgba(16, 185, 129, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                      <ArrowUploadRegular style={{ fontSize: '16px' }} />
                      Import Users
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #1E293B', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="search"
                    placeholder="Search by name or email"
                    value={badgeSearchTerm}
                    onChange={(e) => setBadgeSearchTerm(e.target.value)}
                    style={{
                      flex: '1 1 200px',
                      padding: '10px 16px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }}
                  />
                  <select 
                    value={badgeStatusFilter}
                    onChange={(e) => setBadgeStatusFilter(e.target.value)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                    <option>All Statuses</option>
                    <option>New</option>
                    <option>Sent</option>
                    <option>Downloaded</option>
                    <option>Suspended</option>
                  </select>
                  <select 
                    value={badgeCardTypeFilter}
                    onChange={(e) => setBadgeCardTypeFilter(e.target.value)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                    <option>All Card Types</option>
                    <option>Mifare EV3</option>
                    <option>LEGIC</option>
                    <option>HID</option>
                    <option>NFC</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                          <input type="checkbox" style={{ accentColor: '#3B82F6' }} />
                        </th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Name</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Email</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Company</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Card Type</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '12px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBadgeUsers.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '16px 24px' }}>
                            <input type="checkbox" style={{ accentColor: '#3B82F6' }} />
                          </td>
                          <td style={{ padding: '16px 24px', color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{user.name}</td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>{user.email}</td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>{user.company}</td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: '#1E293B',
                              color: '#94A3B8',
                              border: '1px solid #334155'
                            }}>
                              {user.cardType}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                user.status === 'Downloaded' ? 'rgba(16, 185, 129, 0.1)' :
                                user.status === 'Sent' ? 'rgba(59, 130, 246, 0.1)' :
                                user.status === 'Suspended' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                              color: 
                                user.status === 'Downloaded' ? '#10B981' :
                                user.status === 'Sent' ? '#3B82F6' :
                                user.status === 'Suspended' ? '#EF4444' : '#64748B'
                            }}>
                              {user.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                              {user.status === 'New' && (
                                <>
                                  <button 
                                    onClick={() => handleSendBadgeEmail(user.id)}
                                    title="Send Email"
                                    style={{
                                      backgroundColor: '#60A5FA',
                                      border: 'none',
                                      borderRadius: '6px',
                                      color: '#FFFFFF',
                                      fontSize: '12px',
                                      padding: '8px',
                                      cursor: 'pointer',
                                      boxShadow: '0 0 10px rgba(96, 165, 250, 0.3)',
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.boxShadow = '0 0 15px rgba(96, 165, 250, 0.5)';
                                      e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.boxShadow = '0 0 10px rgba(96, 165, 250, 0.3)';
                                      e.currentTarget.style.transform = 'translateY(0)';
                                    }}>
                                    <MailRegular style={{ fontSize: '16px' }} />
                                  </button>
                                  <button 
                                    onClick={() => handleSendBadgePush(user.id)}
                                    title="Send Push Notification"
                                    style={{
                                      backgroundColor: '#10B981',
                                      border: 'none',
                                      borderRadius: '6px',
                                      color: '#FFFFFF',
                                      fontSize: '12px',
                                      padding: '8px',
                                      cursor: 'pointer',
                                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
                                      e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.3)';
                                      e.currentTarget.style.transform = 'translateY(0)';
                                    }}>
                                    <AlertOnRegular style={{ fontSize: '16px' }} />
                                  </button>
                                </>
                              )}
                              {user.status === 'Downloaded' && (
                                <button 
                                  onClick={() => handleSuspendBadge(user.id)}
                                  title="Suspend Badge"
                                  style={{
                                    backgroundColor: '#F59E0B',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#FFFFFF',
                                    fontSize: '12px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                  }}>
                                  Suspend
                                </button>
                              )}
                              {user.status === 'Suspended' && (
                                <button 
                                  onClick={() => handleRecoverBadge(user.id)}
                                  title="Recover Badge"
                                  style={{
                                    backgroundColor: '#10B981',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#FFFFFF',
                                    fontSize: '12px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                  }}>
                                  Recover
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteBadgeUser(user.id)}
                                title="Delete Badge"
                                style={{
                                  backgroundColor: '#EF4444',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: 'white',
                                  fontSize: '12px',
                                  padding: '8px',
                                  cursor: 'pointer',
                                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <DeleteRegular style={{ fontSize: '16px' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Showing 1-{Math.min(filteredBadgeUsers.length, 5)} of {filteredBadgeUsers.length} users</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#94A3B8',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>Previous</button>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#3B82F6',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>1</button>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#94A3B8',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>2</button>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#94A3B8',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>3</button>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#94A3B8',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>Next</button>
                  </div>
                </div>
              </div>
            </div>
          );})()}

          {/* Close main content div and other closing tags will be added next */}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (() => {
            const activeTenants = globalState.tenants.filter(t => t.status === 'active').length;
            const totalUsers = globalState.users.length;
            const activeUsers = globalState.users.filter(u => u.status === 'active').length;
            const totalBadges = globalState.badges.length;
            const activeBadges = globalState.badges.filter(b => b.status === 'Downloaded').length;
            const totalInvitations = globalState.invitations.length;
            const pendingInvitations = globalState.invitations.filter(i => i.status === 'pending').length;
            const totalTickets = globalState.tickets.length;
            const openTickets = globalState.tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
            
            // Calculate tenant user counts
            const tenantUserCounts = globalState.tenants.map(tenant => ({
              name: tenant.name,
              users: globalState.users.filter(u => u.tenantId === tenant.id).length,
              tenant: tenant
            })).sort((a, b) => b.users - a.users);
            
            return (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Tenants</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>{globalState.tenants.length}</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>{activeTenants} active</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Users</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3B82F6', marginBottom: '8px' }}>{totalUsers}</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>{activeUsers} active</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Digital Badges</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#D7BB91', marginBottom: '8px' }}>{totalBadges}</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>{activeBadges} activated</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Invitations</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B', marginBottom: '8px' }}>{totalInvitations}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{pendingInvitations} pending</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Support Tickets</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>{totalTickets}</div>
                  <div style={{ fontSize: '12px', color: openTickets > 0 ? '#F59E0B' : '#10B981' }}>{openTickets} open</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Parking Spaces</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>{globalState.parkingSpaces.length}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{globalState.parkingSpaces.filter(p => p.status === 'available').length} available</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Lockers</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8B5CF6', marginBottom: '8px' }}>{globalState.lockers.length}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{globalState.lockers.filter(l => l.status === 'available').length} available</div>
                </div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', margin: '0 0 16px 0' }}>Top Tenants by User Count</h4>
                {tenantUserCounts.slice(0, 5).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx < 4 ? '1px solid #1E293B' : 'none' }}>
                    <span style={{ color: '#F1F5F9', fontSize: '14px' }}>{item.name}</span>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{ color: '#64748B', fontSize: '14px' }}>{item.users} users</span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: item.tenant.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: item.tenant.status === 'active' ? '#10B981' : '#EF4444'
                      }}>{item.tenant.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );})()}

          {/* System Settings */}
          {activeSection === 'systemSettings' && (
            <div>
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <InfoRegular style={{ color: '#3B82F6', fontSize: '20px' }} />
                  <h4 style={{ color: '#F1F5F9', fontSize: '16px', margin: 0 }}>Settings Scope</h4>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
                  {selectedTenant === 'all' 
                    ? 'You are viewing Global System Settings. These settings apply as defaults to all tenants unless overridden.'
                    : `You are viewing settings for ${globalState.tenants.find(t => t.id === selectedTenant)?.name}. These settings override global defaults.`
                  }
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* General Settings */}
                <div style={{ backgroundColor: '#162032', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #1E293B', paddingBottom: '12px' }}>General Settings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#F1F5F9', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={systemSettingsForm.emailNotifications}
                        onChange={(e) => setSystemSettingsForm({ ...systemSettingsForm, emailNotifications: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      /> 
                      <div>
                        <div style={{ fontWeight: '500' }}>Enable email notifications</div>
                        <div style={{ color: '#94A3B8', fontSize: '13px' }}>Send email notifications for system events</div>
                      </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#F1F5F9', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={systemSettingsForm.autoApproveInvitations}
                        onChange={(e) => setSystemSettingsForm({ ...systemSettingsForm, autoApproveInvitations: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      /> 
                      <div>
                        <div style={{ fontWeight: '500' }}>Auto-approve invitations</div>
                        <div style={{ color: '#94A3B8', fontSize: '13px' }}>Automatically approve visitor invitations</div>
                      </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#F1F5F9', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={systemSettingsForm.maintenanceMode}
                        onChange={(e) => setSystemSettingsForm({ ...systemSettingsForm, maintenanceMode: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      /> 
                      <div>
                        <div style={{ fontWeight: '500' }}>Maintenance mode</div>
                        <div style={{ color: '#94A3B8', fontSize: '13px' }}>Disable system access for maintenance</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Security Settings */}
                <div style={{ backgroundColor: '#162032', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #1E293B', paddingBottom: '12px' }}>Security</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Session timeout (minutes)</label>
                      <input 
                        type="number" 
                        min="5"
                        max="1440"
                        value={systemSettingsForm.sessionTimeout}
                        onChange={(e) => setSystemSettingsForm({ ...systemSettingsForm, sessionTimeout: parseInt(e.target.value) || 30 })}
                        style={{
                        width: '120px',
                        padding: '10px 12px',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#F1F5F9',
                        fontSize: '14px'
                      }} />
                      <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '6px' }}>Auto logout users after inactivity</div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#F1F5F9', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={systemSettingsForm.require2FA}
                        onChange={(e) => setSystemSettingsForm({ ...systemSettingsForm, require2FA: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      /> 
                      <div>
                        <div style={{ fontWeight: '500' }}>Require 2FA for admins</div>
                        <div style={{ color: '#94A3B8', fontSize: '13px' }}>Enforce two-factor authentication for admin users</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Workflow Management */}
                <div style={{ backgroundColor: '#162032', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #1E293B', paddingBottom: '12px' }}>Workflow Management</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#F1F5F9', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={systemSettingsForm.workflowManagementEnabled}
                      onChange={(e) => setSystemSettingsForm({ ...systemSettingsForm, workflowManagementEnabled: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    /> 
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '15px' }}>Enable Approval Workflow</div>
                      <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '4px' }}>
                        When enabled, all actions on {selectedTenant === 'all' ? 'admin and tenant levels' : 'tenant level'} require approval from authorized users.
                        <br />This adds an extra layer of control for sensitive operations like creating users, badges, invitations, and modifying settings.
                      </div>
                    </div>
                  </label>
                  {systemSettingsForm.workflowManagementEnabled && (
                    <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#0F172A', borderRadius: '8px', border: '1px solid #1E40AF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3B82F6', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                        <CheckmarkCircleRegular style={{ fontSize: '18px' }} />
                        Approval workflow is active
                      </div>
                      <div style={{ color: '#94A3B8', fontSize: '13px' }}>
                        All create, update, and delete operations will be queued for approval in the Tasks section.
                      </div>
                    </div>
                  )}
                </div>

                {/* Background Image */}
                <div style={{ backgroundColor: '#162032', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #1E293B', paddingBottom: '12px' }}>Background Customization</h3>
                  <div>
                    <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '12px', display: 'block' }}>Background Image</label>
                    <div style={{
                      border: '2px dashed #334155',
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                      backgroundColor: '#0F172A',
                      cursor: 'pointer'
                    }}>
                      {systemSettingsForm.backgroundImageData ? (
                        <div>
                          <img 
                            src={systemSettingsForm.backgroundImageData} 
                            alt="Background preview" 
                            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginBottom: '12px' }} 
                          />
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                              onClick={() => document.getElementById('backgroundImageUpload')?.click()}
                              style={{
                                padding: '8px 16px',
                                backgroundColor: '#1E293B',
                                color: '#F1F5F9',
                                border: '1px solid #334155',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Change Image
                            </button>
                            <button
                              onClick={() => setSystemSettingsForm({ ...systemSettingsForm, backgroundImageData: '' })}
                              style={{
                                padding: '8px 16px',
                                backgroundColor: '#7F1D1D',
                                color: '#FCA5A5',
                                border: '1px solid #991B1B',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <ArrowUploadRegular style={{ fontSize: '32px', color: '#64748B', marginBottom: '8px' }} />
                          <div style={{ color: '#F1F5F9', fontSize: '14px', marginBottom: '4px' }}>Upload Background Image</div>
                          <div style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '16px' }}>PNG, JPG up to 5MB</div>
                          <button
                            onClick={() => document.getElementById('backgroundImageUpload')?.click()}
                            style={{
                              padding: '8px 20px',
                              backgroundColor: '#3B82F6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                          >
                            Choose File
                          </button>
                        </div>
                      )}
                      <input
                        id="backgroundImageUpload"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert('File size must be less than 5MB')
                              return
                            }
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              setSystemSettingsForm({ ...systemSettingsForm, backgroundImageData: event.target?.result as string })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '8px' }}>
                      This background will be displayed on login and dashboard screens for {selectedTenant === 'all' ? 'all tenants' : 'this tenant'}
                    </div>
                  </div>
                </div>

                {/* Integrations Panel - Only show when tenant is selected */}
                {selectedTenant !== 'all' && (
                  <div style={{ backgroundColor: '#162032', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
                    <h3 style={{ color: '#F1F5F9', fontSize: '18px', marginBottom: '8px', borderBottom: '1px solid #1E293B', paddingBottom: '12px' }}>Integrations</h3>
                    <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '20px' }}>Configure third-party integrations for each module</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Get enabled modules for this tenant */}
                      {(() => {
                        const tenant = globalState.tenants.find(t => t.id === selectedTenant);
                        if (!tenant) return null;
                        
                        const integrationOptions: Record<string, string[]> = {
                          'User Management': ['NONE', 'NEOX', 'Entra', 'Okta', 'JumpCloud', 'Ping Identity', 'CyberArk', 'OneLogin', 'Clerk'],
                          'Visitor Management': ['NONE', 'NEOX', 'TDS', 'Tablog', 'Sine', 'Envoy', 'Eptura', 'VisitUs'],
                          'Parking': ['NONE', 'NEOX', 'Parkl', 'SkiData'],
                          'Emergency': ['NONE', 'NEOX', 'IBM Tririga'],
                          'Map': ['NONE', 'NEOX', 'Mapbox', 'Google Maps', 'Azure Maps'],
                          'Restaurant': ['NONE', 'Delirest', 'Gundel'],
                          'Ticketing': ['NONE', 'NEOX', 'IBM Tririga', 'IBM Maximo', 'ServiceNow', 'Jira'],
                          'Service Hub': ['NONE', 'Life1', 'Luxuria', 'AYCM', 'EXOS'],
                          'Lockers': ['NONE', 'Vecos', 'Digilock', 'Fleclock'],
                          'News': ['NONE', 'NEOX', 'SharePoint', 'Workplace', 'Simpplr'],
                          'AI Assistant': ['NONE', 'NEOX', 'OpenAI', 'Azure OpenAI', 'Google AI'],
                          'Space Management': ['NONE', 'NEOX', 'IBM Tririga', 'Tablog'],
                          'Private Delivery': ['NONE', 'NEOX', 'Parcel Pending', 'Package Concierge', 'Luxer One'],
                          'Building Automation': ['NONE', 'Siemens', 'Schneider Electric', 'Nective'],
                          'Smart Sensors': ['NONE', 'bGrid', 'Haltian', 'Motorola'],
                          'Access Management': ['NONE', 'NEOX', 'HID', 'ThirdMillennium', 'Avigilon', 'Seawing', 'Kantech']
                        };
                        
                        // Company logos for visual identification (based on brand colors)
                        const providerLogos: Record<string, string> = {
                          // Default
                          'NONE': '⚪',
                          
                          // NEOX Platform
                          'NEOX': '🔷',
                          
                          // Identity & Access Management
                          'Entra': '🟦',        // Microsoft blue
                          'Okta': '🔵',         // Okta blue
                          'JumpCloud': '🟢',    // JumpCloud green
                          'Ping Identity': '🟡', // Ping yellow
                          'CyberArk': '🔴',     // CyberArk red
                          'OneLogin': '🟠',     // OneLogin orange
                          'Clerk': '🟣',        // Clerk purple
                          
                          // Visitor Management
                          'TDS': '🔵',
                          'Tablog': '🟢',
                          'Sine': '🟠',
                          'Envoy': '🔴',
                          'Eptura': '🔵',
                          'VisitUs': '🟣',
                          
                          // Parking
                          'Parkl': '🟢',
                          'SkiData': '🔴',
                          
                          // Building Management & IWMS
                          'IBM Tririga': '🔵',
                          'IBM Maximo': '⚙️',
                          
                          // Ticketing & Service Management
                          'ServiceNow': '🟢',
                          'Jira': '🔵',
                          
                          // Restaurant & Services
                          'Delirest': '🍽️',
                          'Gundel': '🍷',
                          'Life1': '🟣',
                          'Luxuria': '🟡',
                          'AYCM': '🔵',
                          'EXOS': '🟠',
                          
                          // Lockers
                          'Vecos': '🔵',
                          'Digilock': '🟢',
                          'Fleclock': '🟠',
                          
                          // Maps
                          'Mapbox': '🗺️',
                          'Google Maps': '🔴',
                          'Azure Maps': '🔵',
                          
                          // News & Communication
                          'SharePoint': '🟦',
                          'Workplace': '🔵',
                          'Simpplr': '🟣',
                          
                          // AI Assistants
                          'OpenAI': '🤖',
                          'Azure OpenAI': '🔵',
                          'Google AI': '🔴',
                          
                          // Package & Delivery
                          'Parcel Pending': '📦',
                          'Package Concierge': '🟠',
                          'Luxer One': '🔵',
                          
                          // Building Automation
                          'Siemens': '🟢',
                          'Schneider Electric': '🟢',
                          'Nective': '🔵',
                          
                          // Smart Sensors
                          'bGrid': '🟣',
                          'Haltian': '🔵',
                          'Motorola': '🔵',
                          
                          // Access Control
                          'HID': '🔴',
                          'ThirdMillennium': '🟡',
                          'Avigilon': '🔴',
                          'Seawing': '🔵',
                          'Kantech': '🟢'
                        };
                        
                        return tenant.modules
                          .filter(module => integrationOptions[module])
                          .map((module) => (
                          <div key={module} style={{
                            padding: '16px',
                            backgroundColor: '#0F172A',
                            borderRadius: '8px',
                            border: '1px solid #1E293B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{module}</div>
                              <div style={{ color: '#64748B', fontSize: '12px' }}>Select integration provider</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '20px' }}>{providerLogos[moduleIntegrations[module] || integrationOptions[module][0]] || '🟦'}</span>
                              <select
                                value={moduleIntegrations[module] || integrationOptions[module][0]}
                                onChange={(e) => setModuleIntegrations({ ...moduleIntegrations, [module]: e.target.value })}
                                style={{
                                  padding: '8px 12px',
                                  backgroundColor: '#1E293B',
                                  border: '1px solid #334155',
                                  borderRadius: '6px',
                                  color: '#F1F5F9',
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                  minWidth: '200px'
                                }}
                              >
                                {integrationOptions[module].map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <button
                  onClick={() => {
                    const tenantId = selectedTenant === 'all' ? 'global' : selectedTenant
                    globalState.updateSystemSettings(tenantId, systemSettingsForm)
                    alert(`System settings ${selectedTenant === 'all' ? 'for global' : 'for ' + globalState.tenants.find(t => t.id === selectedTenant)?.name} saved successfully!`)
                  }}
                  style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 28px',
                    fontWeight: '600',
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {activeSection === 'auditLogs' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 170px)' }}>
              <div style={{ marginBottom: '16px' }}>
                <input type="search" placeholder="Search logs..." style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(51, 78, 104, 0.5)',
                  border: '1px solid rgba(75, 101, 129, 0.3)',
                  borderRadius: '8px',
                  color: '#d7bb91',
                  fontSize: '14px'
                }} />
              </div>
              <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B', padding: '16px' }}>
                {globalState.auditLogs.length === 0 ? (
                  <div style={{ color: '#d7bb91', opacity: 0.7, textAlign: 'center', padding: '24px' }}>No audit logs available</div>
                ) : (
                  globalState.auditLogs.map((log) => (
                    <div key={log.id} style={{
                      padding: '12px',
                      backgroundColor: 'rgba(51, 78, 104, 0.3)',
                      borderRadius: '8px',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500' }}>{log.action}</div>
                          <div style={{ color: '#d7bb91', opacity: 0.7, fontSize: '12px' }}>{log.user} - {new Date(log.timestamp).toLocaleString()}</div>
                        </div>
                        <span style={{
                          backgroundColor: log.status === 'Success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                          color: log.status === 'Success' ? '#10b981' : '#ef4444',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>{log.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* White Label */}
          {activeSection === 'whiteLabel' && selectedTenant !== 'all' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Branding Section */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Brand Identity</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company Name</label>
                      <input 
                        type="text" 
                        placeholder="Your Company Name" 
                        value={whiteLabelForm.companyName}
                        onChange={(e) => setWhiteLabelForm({ ...whiteLabelForm, companyName: e.target.value })}
                        style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company Logo</label>
                      <div style={{
                        border: '2px dashed rgba(75, 101, 129, 0.5)',
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                        backgroundColor: 'rgba(51, 78, 104, 0.1)'
                      }}>
                        {whiteLabelForm.logoData && (
                          <div style={{ marginBottom: '16px' }}>
                            <img 
                              src={whiteLabelForm.logoData} 
                              alt="Company Logo Preview" 
                              style={{ 
                                maxWidth: '200px', 
                                maxHeight: '200px', 
                                borderRadius: '8px',
                                border: '2px solid rgba(215, 187, 145, 0.3)'
                              }} 
                            />
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          id="logo-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Check file size (2MB max)
                              if (file.size > 2 * 1024 * 1024) {
                                alert('File size must be less than 2MB');
                                return;
                              }
                              
                              // Create image to check dimensions
                              const img = new Image();
                              const reader = new FileReader();
                              
                              reader.onload = (ev) => {
                                img.onload = () => {
                                  // Check image dimensions (512x512 max)
                                  if (img.width > 512 || img.height > 512) {
                                    alert('Image dimensions must be 512x512 pixels or smaller');
                                    return;
                                  }
                                  
                                  // If all validations pass, save the image
                                  const base64 = ev.target?.result as string;
                                  setWhiteLabelForm({ ...whiteLabelForm, logoData: base64 });
                                  alert('Logo uploaded successfully!');
                                };
                                img.src = ev.target?.result as string;
                              };
                              
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label htmlFor="logo-upload" style={{
                          backgroundColor: 'rgba(75, 101, 129, 0.6)',
                          color: '#d7bb91',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'inline-block'
                        }}>{whiteLabelForm.logoData ? 'Change Logo' : 'Upload Logo'}</label>
                        <p style={{ color: '#d7bb91', opacity: 0.7, margin: '8px 0 0 0', fontSize: '12px' }}>PNG, JPG, SVG (max 512x512px, 2MB)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Scheme Section */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Colors & Typography</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <ColorPicker
                      label="Primary Brand Color"
                      value={whiteLabelForm.primaryColor}
                      onChange={(value) => setWhiteLabelForm({ ...whiteLabelForm, primaryColor: value })}
                    />
                    
                    <ColorPicker
                      label="Secondary Brand Color"
                      value={whiteLabelForm.secondaryColor}
                      onChange={(value) => setWhiteLabelForm({ ...whiteLabelForm, secondaryColor: value })}
                    />
                  </div>
                </div>

                {/* Font Family Section */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Font Family</h3>
                  <FontFamilySelector
                    value={whiteLabelForm.fontFamily}
                    onChange={(value) => setWhiteLabelForm({ ...whiteLabelForm, fontFamily: value })}
                  />
                </div>

                {/* Save Button */}
                <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid rgba(75, 101, 129, 0.3)' }}>
                  <button 
                    onClick={() => {
                      if (!whiteLabelForm.companyName) {
                        alert('Company name is required');
                        return;
                      }
                      globalState.updateWhiteLabel(selectedTenant, {
                        companyName: whiteLabelForm.companyName,
                        logoData: whiteLabelForm.logoData,
                        primaryColor: whiteLabelForm.primaryColor,
                        secondaryColor: whiteLabelForm.secondaryColor,
                        fontFamily: whiteLabelForm.fontFamily
                      });
                      alert('White label settings saved successfully!');
                    }}
                    style={{
                      backgroundColor: 'rgba(75, 101, 129, 0.8)',
                      color: '#d7bb91',
                      border: '1px solid rgba(75, 101, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '16px 32px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '16px',
                      minWidth: '200px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(75, 101, 129, 1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(75, 101, 129, 0.8)'}
                  >Save White Label Settings</button>
                </div>
              </div>
            </div>
          )}

          {/* Ticket Management */}
          {activeSection === 'ticketManagement' && (
            <div>
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>Support Tickets</h2>
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Manage support tickets from tenants</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select style={{
                      padding: '8px 16px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      <option>All Status</option>
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                      <option>Closed</option>
                    </select>
                    <select style={{
                      padding: '8px 16px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      <option>All Priority</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket ID</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tenant</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</th>
                        <th style={{ padding: '16px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalState.tickets.map((ticket, index) => {
                        const ticketTenant = globalState.tenants.find(t => t.id === ticket.tenantId);
                        return (
                        <tr key={ticket.id} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ color: '#3B82F6', fontSize: '14px', fontWeight: '600', fontFamily: 'monospace' }}>{ticket.ticketNumber}</div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>{ticketTenant?.name || 'N/A'}</div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ color: '#F1F5F9', fontSize: '14px', maxWidth: '300px' }}>{ticket.title}</div>
                            <div style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>Assigned to: {ticket.assignedToName || 'Unassigned'}</div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                ticket.priority === 'critical' ? 'rgba(239, 68, 68, 0.2)' :
                                ticket.priority === 'high' ? 'rgba(245, 158, 11, 0.2)' :
                                ticket.priority === 'medium' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                              color: 
                                ticket.priority === 'critical' ? '#EF4444' :
                                ticket.priority === 'high' ? '#F59E0B' :
                                ticket.priority === 'medium' ? '#3B82F6' : '#64748B'
                            }}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                ticket.status === 'open' ? 'rgba(239, 68, 68, 0.1)' :
                                ticket.status === 'in-progress' ? 'rgba(59, 130, 246, 0.1)' :
                                ticket.status === 'resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                              color: 
                                ticket.status === 'open' ? '#EF4444' :
                                ticket.status === 'in-progress' ? '#3B82F6' :
                                ticket.status === 'resolved' ? '#10B981' : '#64748B'
                            }}>
                              {ticket.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', color: '#64748B', fontSize: '13px' }}>{new Date(ticket.createdAt).toLocaleString()}</td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button 
                              onClick={() => alert(`Ticket: ${ticket.ticketNumber}\n\nTitle: ${ticket.title}\n\nDescription: ${ticket.description}\n\nStatus: ${ticket.status}\n\nPriority: ${ticket.priority}\n\nCategory: ${ticket.category}\n\nCreated by: ${ticket.createdByName}`)}
                              style={{
                              backgroundColor: '#3B82F6',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              marginRight: '8px'
                            }}>View</button>
                            <button 
                              onClick={() => {
                                const assignToUser = prompt('Enter user email to assign ticket to:');
                                if (assignToUser) {
                                  const user = globalState.users.find(u => u.email.toLowerCase() === assignToUser.toLowerCase());
                                  if (user) {
                                    globalState.updateTicket(ticket.id, { assignedTo: user.id, assignedToName: user.name, status: 'in-progress' });
                                    alert(`Ticket ${ticket.ticketNumber} assigned to ${user.name}`);
                                  } else {
                                    alert('User not found');
                                  }
                                }
                              }}
                              style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #1E293B',
                              borderRadius: '6px',
                              color: '#64748B',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer'
                            }}>Assign</button>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ticket Statistics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '24px'
              }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#EF4444', marginBottom: '8px' }}>8</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Open Tickets</div>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#3B82F6', marginBottom: '8px' }}>5</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>In Progress</div>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981', marginBottom: '8px' }}>42</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Resolved This Month</div>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#F59E0B', marginBottom: '8px' }}>2.4h</div>
                  <div style={{ color: '#64748B', fontSize: '14px' }}>Avg Response Time</div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div>
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h2 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: 0 }}>System Notifications</h2>
                    <p style={{ color: '#64748B', fontSize: '14px', margin: '4px 0 0 0' }}>Important system alerts and updates</p>
                  </div>
                  <button style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>Mark All Read</button>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { id: 1, type: 'Critical', title: 'System Maintenance Scheduled', message: 'Planned maintenance window on Oct 25, 2025 from 2:00 AM - 4:00 AM UTC', time: '2 hours ago', unread: true },
                      { id: 2, type: 'Warning', title: 'High CPU Usage Detected', message: 'Server load has exceeded 85% for the past 30 minutes', time: '5 hours ago', unread: true },
                      { id: 3, type: 'Info', title: 'New Feature Released', message: 'Enhanced reporting module is now available for all tenants', time: '1 day ago', unread: false },
                      { id: 4, type: 'Success', title: 'Backup Completed Successfully', message: 'Daily system backup completed without errors', time: '1 day ago', unread: false },
                      { id: 5, type: 'Warning', title: 'SSL Certificate Expiring Soon', message: 'Your SSL certificate will expire in 30 days. Please renew.', time: '2 days ago', unread: false },
                      { id: 6, type: 'Info', title: 'Security Update Available', message: 'A new security patch is available for installation', time: '3 days ago', unread: false },
                    ].map((notification) => (
                      <div key={notification.id} style={{
                        padding: '16px',
                        backgroundColor: notification.unread ? 'rgba(59, 130, 246, 0.05)' : '#1E293B',
                        borderRadius: '8px',
                        border: `1px solid ${notification.unread ? 'rgba(59, 130, 246, 0.2)' : '#1E293B'}`,
                        display: 'flex',
                        gap: '16px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          backgroundColor: 
                            notification.type === 'Critical' ? 'rgba(239, 68, 68, 0.2)' :
                            notification.type === 'Warning' ? 'rgba(245, 158, 11, 0.2)' :
                            notification.type === 'Success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          flexShrink: 0,
                          boxShadow: 
                            notification.type === 'Critical' ? '0 0 20px rgba(239, 68, 68, 0.5)' :
                            notification.type === 'Warning' ? '0 0 20px rgba(245, 158, 11, 0.5)' :
                            notification.type === 'Success' ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 0 20px rgba(59, 130, 246, 0.5)',
                          color: 
                            notification.type === 'Critical' ? '#EF4444' :
                            notification.type === 'Warning' ? '#F59E0B' :
                            notification.type === 'Success' ? '#10B981' : '#3B82F6'
                        }}>
                          {notification.type === 'Critical' ? <ErrorCircleRegular /> : 
                           notification.type === 'Warning' ? <WarningRegular /> : 
                           notification.type === 'Success' ? <CheckmarkCircleRegular /> : <InfoRegular />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                              {notification.title}
                              {notification.unread && (
                                <span style={{
                                  marginLeft: '8px',
                                  width: '8px',
                                  height: '8px',
                                  backgroundColor: '#3B82F6',
                                  borderRadius: '50%',
                                  display: 'inline-block'
                                }}></span>
                              )}
                            </h3>
                            <span style={{ color: '#64748B', fontSize: '12px', whiteSpace: 'nowrap' }}>{notification.time}</span>
                          </div>
                          <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 12px 0' }}>{notification.message}</p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #334155',
                              borderRadius: '6px',
                              color: '#94A3B8',
                              fontSize: '12px',
                              padding: '4px 12px',
                              cursor: 'pointer'
                            }}>View Details</button>
                            {notification.unread && (
                              <button style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #334155',
                                borderRadius: '6px',
                                color: '#3B82F6',
                                fontSize: '12px',
                                padding: '4px 12px',
                                cursor: 'pointer'
                              }}>Mark as Read</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Status */}
          {activeSection === 'systemStatus' && (
            <div>
              {/* Overall Status */}
              <div style={{
                padding: '24px',
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                }}>
                  <span style={{ fontSize: '32px' }}>✓</span>
                </div>
                <h2 style={{ color: '#10B981', fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>All Systems Operational</h2>
                <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Last checked: Just now</p>
              </div>

              {/* Service Status Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                {[
                  { name: 'API Gateway', status: 'Operational', uptime: '99.99%', responseTime: '45ms' },
                  { name: 'Database', status: 'Operational', uptime: '99.98%', responseTime: '12ms' },
                  { name: 'Authentication Service', status: 'Operational', uptime: '100%', responseTime: '23ms' },
                  { name: 'File Storage', status: 'Operational', uptime: '99.97%', responseTime: '89ms' },
                  { name: 'Email Service', status: 'Operational', uptime: '99.95%', responseTime: '156ms' },
                  { name: 'Notification System', status: 'Operational', uptime: '99.99%', responseTime: '34ms' },
                ].map((service, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    backgroundColor: '#162032',
                    borderRadius: '12px',
                    border: '1px solid #1E293B'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', margin: 0 }}>{service.name}</h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10B981'
                      }}>{service.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#64748B', fontSize: '13px' }}>Uptime</span>
                      <span style={{ color: '#F1F5F9', fontSize: '13px', fontWeight: '500' }}>{service.uptime}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B', fontSize: '13px' }}>Response Time</span>
                      <span style={{ color: '#F1F5F9', fontSize: '13px', fontWeight: '500' }}>{service.responseTime}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Incidents */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Recent Incidents</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  {[
                    { date: 'Oct 20, 2025', title: 'Database Connection Issue', status: 'Resolved', duration: '15 minutes', severity: 'Minor' },
                    { date: 'Oct 18, 2025', title: 'API Rate Limiting', status: 'Resolved', duration: '45 minutes', severity: 'Moderate' },
                    { date: 'Oct 15, 2025', title: 'Scheduled Maintenance', status: 'Completed', duration: '2 hours', severity: 'Planned' },
                  ].map((incident, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      marginBottom: index < 2 ? '12px' : 0
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div>
                          <h4 style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>{incident.title}</h4>
                          <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>{incident.date} • Duration: {incident.duration}</p>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: '#10B981',
                          whiteSpace: 'nowrap'
                        }}>{incident.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Policies */}
          {activeSection === 'policies' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: '#d7bb91', fontSize: '14px', marginBottom: '24px' }}>
                  Upload and manage policy documents. These policies will be available for download by all tenants.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {Object.keys(globalState.policyFiles).map((policyName) => (
                  <div key={policyName} style={{
                    padding: '24px',
                    backgroundColor: 'rgba(51, 78, 104, 0.3)',
                    borderRadius: '12px',
                    border: '1px solid rgba(75, 101, 129, 0.3)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(75, 101, 129, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        📄
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: '#d7bb91', fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>
                          {policyName}
                        </h3>
                        {globalState.policyFiles[policyName] ? (
                          <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>
                            Uploaded: {globalState.policyFiles[policyName]?.uploadDate}
                          </p>
                        ) : (
                          <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>
                            No file uploaded
                          </p>
                        )}
                      </div>
                    </div>

                    {globalState.policyFiles[policyName] && (
                      <div style={{
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ color: '#d7bb91', fontSize: '14px', margin: '0 0 4px 0', fontWeight: '500' }}>
                              Current File:
                            </p>
                            <p style={{ color: '#d7bb91', fontSize: '13px', margin: 0, opacity: 0.8 }}>
                              {globalState.policyFiles[policyName]?.name}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              const policy = globalState.downloadPolicy(policyName);
                              if (policy && policy.fileData) {
                                const link = document.createElement('a');
                                link.href = policy.fileData;
                                link.download = policy.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                alert(`Downloaded: ${policy.name}`);
                              } else {
                                alert('File not available for download');
                              }
                            }}
                            style={{
                              backgroundColor: '#10B981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              fontSize: '13px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
                          >
                            📥 Download
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={{
                      border: '2px dashed rgba(75, 101, 129, 0.5)',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      backgroundColor: 'rgba(51, 78, 104, 0.1)'
                    }}>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        style={{ display: 'none' }}
                        id={`policy-${policyName.replace(/\s+/g, '-')}`}
                        onChange={(e) => handlePolicyUpload(policyName, e)}
                      />
                      <label
                        htmlFor={`policy-${policyName.replace(/\s+/g, '-')}`}
                        style={{
                          backgroundColor: 'rgba(75, 101, 129, 0.8)',
                          color: '#d7bb91',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '6px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'inline-block',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(75, 101, 129, 1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(75, 101, 129, 0.8)'}
                      >
                        {globalState.policyFiles[policyName] ? 'Replace File' : 'Upload PDF'}
                      </label>
                      <p style={{ color: '#d7bb91', opacity: 0.7, margin: '8px 0 0 0', fontSize: '12px' }}>
                        PDF files only (max 10MB)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parking Management */}
          {/* Locker Management */}
          {activeSection === 'lockerManagement' && selectedTenant !== 'all' && (
            <div>
              {/* Stats Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Lockers</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F1F5F9' }}>{globalState.lockers.filter(l => l.tenantId === selectedTenant).length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Available</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>{globalState.lockers.filter(l => l.tenantId === selectedTenant && l.status === 'available').length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Occupied</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444' }}>{globalState.lockers.filter(l => l.tenantId === selectedTenant && l.status === 'occupied').length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Maintenance</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B' }}>{globalState.lockers.filter(l => l.tenantId === selectedTenant && l.status === 'maintenance').length}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <button onClick={() => {
                  setEditingLocker({
                    lockerNumber: '',
                    name: '',
                    building: '',
                    floor: '',
                    zone: '',
                    type: 'permanent',
                    notes: ''
                  });
                  setShowLockerModal(true);
                }} style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>+ Add Locker</button>
              </div>

              {/* Lockers Table */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Lockers for {globalState.tenants.find(t => t.id === selectedTenant)?.name}</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Locker Number</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Building/Floor</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Type</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Assigned To</th>
                        <th style={{ padding: '12px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalState.lockers.filter(l => l.tenantId === selectedTenant).map((locker) => (
                        <tr key={locker.id} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '16px 24px', color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>
                            {locker.lockerNumber}
                            {locker.name && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{locker.name}</div>}
                          </td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>
                            {locker.building}
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Floor {locker.floor}{locker.zone && ` - ${locker.zone}`}</div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                locker.type === 'permanent' ? 'rgba(139, 92, 246, 0.1)' :
                                locker.type === 'gym' ? 'rgba(16, 185, 129, 0.1)' :
                                locker.type === 'bike' ? 'rgba(59, 130, 246, 0.1)' :
                                locker.type === 'temporary' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                              color: 
                                locker.type === 'permanent' ? '#8B5CF6' :
                                locker.type === 'gym' ? '#10B981' :
                                locker.type === 'bike' ? '#3B82F6' :
                                locker.type === 'temporary' ? '#F59E0B' : '#64748B'
                            }}>
                              {locker.type.charAt(0).toUpperCase() + locker.type.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                locker.status === 'available' ? 'rgba(16, 185, 129, 0.1)' :
                                locker.status === 'occupied' ? 'rgba(239, 68, 68, 0.1)' :
                                locker.status === 'reserved' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                              color: 
                                locker.status === 'available' ? '#10B981' :
                                locker.status === 'occupied' ? '#EF4444' :
                                locker.status === 'reserved' ? '#F59E0B' : '#64748B'
                            }}>
                              {locker.status.charAt(0).toUpperCase() + locker.status.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>
                            {locker.assignedToName || '-'}
                            {locker.assignedDate && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Since {new Date(locker.assignedDate).toLocaleDateString()}</div>}
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button onClick={() => {
                              setEditingLocker({
                                id: locker.id,
                                lockerNumber: locker.lockerNumber,
                                name: locker.name || '',
                                building: locker.building,
                                floor: locker.floor,
                                zone: locker.zone || '',
                                type: locker.type,
                                notes: locker.notes || ''
                              });
                              setShowLockerModal(true);
                            }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#3B82F6',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              marginRight: '8px'
                            }}>Edit</button>
                            {locker.status === 'occupied' && (
                              <button onClick={() => {
                                if (confirm(`Release locker ${locker.lockerNumber}?`)) {
                                  globalState.updateLocker(locker.id, {
                                    status: 'available',
                                    assignedTo: undefined,
                                    assignedToName: undefined,
                                    assignedDate: undefined
                                  })
                                  alert('Locker released!')
                                }
                              }} style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #475569',
                                borderRadius: '6px',
                                color: '#F59E0B',
                                fontSize: '12px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                marginRight: '8px'
                              }}>Release</button>
                            )}
                            <button onClick={() => {
                              if (confirm(`Delete locker ${locker.lockerNumber}? This action cannot be undone.`)) {
                                globalState.updateLocker(locker.id, { status: 'available', tenantId: undefined });
                                alert('Locker deleted!');
                              }
                            }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#EF4444',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer'
                            }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Space Management */}
          {activeSection === 'spaceManagement' && selectedTenant !== 'all' && (
            <div>
              {/* Stats Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Spaces</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F1F5F9' }}>{globalState.spaces.filter(s => s.tenantId === selectedTenant).length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Available</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>{globalState.spaces.filter(s => s.tenantId === selectedTenant && s.status === 'available').length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Assigned</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444' }}>{globalState.spaces.filter(s => s.tenantId === selectedTenant && s.status === 'occupied').length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Maintenance</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B' }}>{globalState.spaces.filter(s => s.tenantId === selectedTenant && s.status === 'maintenance').length}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <button onClick={() => {
                  setEditingSpace({
                    spaceNumber: '',
                    name: '',
                    building: '',
                    floor: '',
                    location: '',
                    zone: '',
                    type: 'desk',
                    capacity: 1,
                    notes: ''
                  });
                  setShowSpaceModal(true);
                }} style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>+ Add Space</button>
              </div>

              {/* Spaces Table */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Spaces for {globalState.tenants.find(t => t.id === selectedTenant)?.name}</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Space Number</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Building/Floor</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Type</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Capacity</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Assigned To</th>
                        <th style={{ padding: '12px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalState.spaces.filter(s => s.tenantId === selectedTenant).map((space) => (
                        <tr key={space.id} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '16px 24px', color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>
                            {space.spaceNumber}
                            {space.name && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{space.name}</div>}
                          </td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>
                            {space.building}
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Floor {space.floor}{space.zone && ` - ${space.zone}`}</div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                space.type === 'desk' ? 'rgba(59, 130, 246, 0.1)' :
                                space.type === 'office' ? 'rgba(139, 92, 246, 0.1)' :
                                space.type === 'meeting-room' ? 'rgba(16, 185, 129, 0.1)' :
                                space.type === 'conference-room' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                              color: 
                                space.type === 'desk' ? '#3B82F6' :
                                space.type === 'office' ? '#8B5CF6' :
                                space.type === 'meeting-room' ? '#10B981' :
                                space.type === 'conference-room' ? '#F59E0B' : '#EC4899'
                            }}>
                              {space.type === 'meeting-room' ? 'Meeting Room' : space.type === 'conference-room' ? 'Conference Room' : space.type === 'social-hub' ? 'Social Hub' : space.type.charAt(0).toUpperCase() + space.type.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>
                            {space.capacity} {space.capacity === 1 ? 'person' : 'people'}
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                space.status === 'available' ? 'rgba(16, 185, 129, 0.1)' :
                                space.status === 'occupied' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                              color: 
                                space.status === 'available' ? '#10B981' :
                                space.status === 'occupied' ? '#EF4444' : '#64748B'
                            }}>
                              {space.status.charAt(0).toUpperCase() + space.status.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>
                            {space.assignedToName || '-'}
                            {space.assignedDate && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Since {new Date(space.assignedDate).toLocaleDateString()}</div>}
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button onClick={() => {
                              setEditingSpace({
                                id: space.id,
                                spaceNumber: space.spaceNumber,
                                name: space.name || '',
                                building: space.building,
                                floor: space.floor,
                                location: space.location || '',
                                zone: space.zone || '',
                                type: space.type,
                                capacity: space.capacity || 1,
                                notes: space.notes || ''
                              });
                              setShowSpaceModal(true);
                            }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#3B82F6',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              marginRight: '8px'
                            }}>Edit</button>
                            {space.status === 'occupied' && (
                              <button onClick={() => {
                                if (confirm(`Release space ${space.spaceNumber}?`)) {
                                  globalState.updateSpace(space.id, {
                                    status: 'available',
                                    assignedTo: undefined,
                                    assignedToName: undefined,
                                    assignedDate: undefined
                                  })
                                  alert('Space released!')
                                }
                              }} style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #475569',
                                borderRadius: '6px',
                                color: '#F59E0B',
                                fontSize: '12px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                marginRight: '8px'
                              }}>Release</button>
                            )}
                            <button onClick={() => {
                              if (confirm(`Delete space ${space.spaceNumber}? This action cannot be undone.`)) {
                                globalState.updateSpace(space.id, { status: 'available', tenantId: undefined });
                                alert('Space deleted!');
                              }
                            }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#EF4444',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer'
                            }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Building Management */}
          {activeSection === 'buildingManagement' && selectedTenant !== 'all' && (
            <div>
              {/* Stats Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Buildings</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F1F5F9' }}>{globalState.buildings.filter(b => b.tenantId === selectedTenant).length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Floors</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>
                    {globalState.buildings.filter(b => b.tenantId === selectedTenant).reduce((sum, b) => sum + b.floors.length, 0)}
                  </div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Zones</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3B82F6' }}>
                    {globalState.buildings.filter(b => b.tenantId === selectedTenant).reduce((sum, b) => sum + b.floors.reduce((zoneSum, f) => zoneSum + f.zones.length, 0), 0)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <button onClick={() => {
                  setEditingBuilding({
                    name: '',
                    basementLevels: 0,
                    topFloor: 10
                  });
                  setShowBuildingModal(true);
                }} style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>+ Add Building</button>
              </div>

              {/* Buildings List */}
              {globalState.buildings.filter(b => b.tenantId === selectedTenant).map((building) => (
                <div key={building.id} style={{
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B',
                  overflow: 'hidden',
                  marginBottom: '24px'
                }}>
                  <div style={{ padding: '24px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ color: '#F1F5F9', fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>{building.name}</h3>
                      <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                        {building.floors.length} floors • {building.basementLevels} basement{building.basementLevels !== 1 ? 's' : ''} • Top floor: {building.topFloor}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => {
                        setEditingBuilding({
                          id: building.id,
                          name: building.name,
                          basementLevels: building.basementLevels,
                          topFloor: building.topFloor
                        });
                        setShowBuildingModal(true);
                      }} style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        color: '#3B82F6',
                        fontSize: '12px',
                        padding: '8px 16px',
                        cursor: 'pointer'
                      }}>Edit</button>
                      <button onClick={() => {
                        if (confirm(`Delete ${building.name}? This action cannot be undone.`)) {
                          globalState.deleteBuilding(building.id);
                          alert('Building deleted!');
                        }
                      }} style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        color: '#EF4444',
                        fontSize: '12px',
                        padding: '8px 16px',
                        cursor: 'pointer'
                      }}>Delete</button>
                    </div>
                  </div>

                  {/* Floor Visualization */}
                  <div style={{ padding: '24px' }}>
                    <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Floor Configuration</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                      {building.floors.map((floor) => (
                        <div key={floor.floorNumber} style={{
                          backgroundColor: '#0F1629',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid #1E293B'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <div style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600' }}>
                                {floor.floorLabel === 'Ground' ? 'Ground Floor' : `Floor ${floor.floorLabel}`}
                              </div>
                              <div style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>
                                {floor.zones.length} zone{floor.zones.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: floor.floorNumber < 0 ? 'rgba(139, 92, 246, 0.1)' : floor.floorNumber === 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              color: floor.floorNumber < 0 ? '#8B5CF6' : floor.floorNumber === 0 ? '#10B981' : '#3B82F6'
                            }}>
                              {floor.floorNumber < 0 ? 'Basement' : floor.floorNumber === 0 ? 'Ground' : 'Above'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {floor.zones.map((zone, zoneIdx) => (
                              <span key={zoneIdx} style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                backgroundColor: 'rgba(100, 116, 139, 0.1)',
                                color: '#94A3B8',
                                border: '1px solid #334155'
                              }}>
                                {zone}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {globalState.buildings.filter(b => b.tenantId === selectedTenant).length === 0 && (
                <div style={{
                  backgroundColor: '#162032',
                  borderRadius: '12px',
                  border: '1px solid #1E293B',
                  padding: '48px 24px',
                  textAlign: 'center'
                }}>
                  <BuildingRegular style={{ fontSize: '48px', color: '#475569', marginBottom: '16px' }} />
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No Buildings Configured</h3>
                  <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>Add your first building to get started with building management.</p>
                  <button onClick={() => {
                    setEditingBuilding({
                      name: '',
                      basementLevels: 0,
                      topFloor: 10
                    });
                    setShowBuildingModal(true);
                  }} style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>+ Add Building</button>
                </div>
              )}
            </div>
          )}

          {/* Parking Management */}
          {activeSection === 'parkingManagement' && selectedTenant !== 'all' && (
            <div>
              {/* Stats Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Total Spaces</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F1F5F9' }}>{globalState.parkingSpaces.filter(p => p.tenantId === selectedTenant).length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Available</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>{globalState.parkingSpaces.filter(p => p.tenantId === selectedTenant && p.status === 'available').length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Occupied</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444' }}>{globalState.parkingSpaces.filter(p => p.tenantId === selectedTenant && p.status === 'occupied').length}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#162032', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <h4 style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px 0' }}>Reserved</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B' }}>{globalState.parkingSpaces.filter(p => p.tenantId === selectedTenant && p.status === 'reserved').length}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <button onClick={() => {
                  setEditingParkingSpace({
                    spaceNumber: '',
                    name: '',
                    building: '',
                    location: '',
                    level: '',
                    floor: '',
                    isElectric: false,
                    isDisabled: false,
                    isSpecialNeed: false,
                    isVIP: false,
                    isReservedForVisitor: false,
                    notes: ''
                  });
                  setShowParkingModal(true);
                }} style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>+ Add Parking Space</button>
              </div>

              {/* Parking Spaces Table */}
              <div style={{
                backgroundColor: '#162032',
                borderRadius: '12px',
                border: '1px solid #1E293B',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #1E293B' }}>
                  <h3 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '600', margin: 0 }}>Parking Spaces for {globalState.tenants.find(t => t.id === selectedTenant)?.name}</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0F1629' }}>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Space Number</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Building/Location</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Features</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Assigned To</th>
                        <th style={{ padding: '12px 24px', textAlign: 'right', color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalState.parkingSpaces.filter(p => p.tenantId === selectedTenant).map((space) => (
                        <tr key={space.id} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '16px 24px', color: '#F1F5F9', fontSize: '14px', fontWeight: '500' }}>
                            {space.spaceNumber}
                            {space.name && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{space.name}</div>}
                          </td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>
                            {space.building}
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{space.location}</div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {space.isElectric && <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '4px' }}>⚡ EV</span>}
                              {space.isDisabled && <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', borderRadius: '4px' }}>♿ Disabled</span>}
                              {space.isVIP && <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', borderRadius: '4px' }}>⭐ VIP</span>}
                              {space.isSpecialNeed && <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', borderRadius: '4px' }}>Special</span>}
                              {space.isReservedForVisitor && <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#EC4899', borderRadius: '4px' }}>Visitor</span>}
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                space.status === 'available' ? 'rgba(16, 185, 129, 0.1)' :
                                space.status === 'occupied' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                              color: 
                                space.status === 'available' ? '#10B981' :
                                space.status === 'occupied' ? '#EF4444' : '#F59E0B'
                            }}>
                              {space.status.charAt(0).toUpperCase() + space.status.slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', color: '#94A3B8', fontSize: '14px' }}>
                            {space.assignedToName || '-'}
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button onClick={() => {
                              setEditingParkingSpace({
                                id: space.id,
                                spaceNumber: space.spaceNumber,
                                name: space.name || '',
                                building: space.building,
                                location: space.location,
                                level: space.level || '',
                                floor: space.floor || '',
                                isElectric: space.isElectric || false,
                                isDisabled: space.isDisabled || false,
                                isSpecialNeed: space.isSpecialNeed || false,
                                isVIP: space.isVIP || false,
                                isReservedForVisitor: space.isReservedForVisitor || false,
                                notes: space.notes || ''
                              });
                              setShowParkingModal(true);
                            }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#3B82F6',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              marginRight: '8px'
                            }}>Edit</button>
                            {space.status === 'occupied' && (
                              <button onClick={() => {
                                if (confirm(`Release parking space ${space.spaceNumber}?`)) {
                                  globalState.updateParkingSpace(space.id, {
                                    status: 'available',
                                    assignedTo: undefined,
                                    assignedToName: undefined,
                                    vehiclePlate: undefined,
                                    assignedDate: undefined
                                  })
                                  alert('Parking space released!')
                                }
                              }} style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #475569',
                                borderRadius: '6px',
                                color: '#F59E0B',
                                fontSize: '12px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                marginRight: '8px'
                              }}>Release</button>
                            )}
                            <button onClick={() => {
                              if (confirm(`Delete parking space ${space.spaceNumber}? This action cannot be undone.`)) {
                                globalState.updateParkingSpace(space.id, { status: 'available', tenantId: undefined });
                                alert('Parking space deleted!');
                              }
                            }} style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#EF4444',
                              fontSize: '12px',
                              padding: '6px 12px',
                              cursor: 'pointer'
                            }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tenants List */}
          {activeSection === 'tenantsList' && (
            <div>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
                <input type="search" placeholder="Search tenants..." style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  outline: 'none'
                }} />
                <button onClick={() => { setSelectedTenant('all'); setActiveSection('tenantCreate'); }} style={{
                  backgroundColor: '#3B82F6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: '500',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>+ Create Tenant</button>
              </div>
              <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                {globalState.tenants.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    <p style={{ fontSize: '16px', marginBottom: '8px' }}>No tenants created yet</p>
                    <p style={{ fontSize: '14px' }}>Click &quot;Create Tenant&quot; to add your first tenant</p>
                  </div>
                ) : (
                  globalState.tenants.sort((a, b) => a.name.localeCompare(b.name)).map((tenant) => {
                    const userCount = globalState.users.filter(u => u.tenantId === tenant.id).length;
                    return (
                      <div key={tenant.id} style={{
                        padding: '20px',
                        backgroundColor: '#162032',
                        borderRadius: '12px',
                        border: '1px solid #1E293B',
                        marginBottom: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1E293B';
                        e.currentTarget.style.borderColor = '#334155';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#162032';
                        e.currentTarget.style.borderColor = '#1E293B';
                      }}>
                        <div>
                          <h4 style={{ color: '#F1F5F9', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>{tenant.name}</h4>
                          <p style={{ color: '#94A3B8', margin: '0 0 8px 0', fontSize: '14px' }}>{tenant.contactEmail}{tenant.contactPhone ? ` • ${tenant.contactPhone}` : ''}</p>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: tenant.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                              color: tenant.status === 'active' ? '#10B981' : '#F59E0B'
                            }}>
                              {tenant.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                            <span style={{ color: '#64748B', fontSize: '13px' }}>{userCount} users</span>
                            <span style={{ color: '#64748B', fontSize: '13px' }}>{tenant.modules.length} modules</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => { setSelectedTenant(tenant.id); setActiveSection('tenantEdit'); }} style={{
                            backgroundColor: '#3B82F6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.3)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}>Edit</button>
                          <button onClick={() => {
                            if (confirm(`Delete tenant "${tenant.name}"? This action cannot be undone.`)) {
                              globalState.deleteTenant(tenant.id);
                              alert('Tenant deleted successfully');
                            }
                          }} style={{
                            backgroundColor: '#EF4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}>Delete</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Tenant Edit/Create */}
          {(activeSection === 'tenantEdit' || activeSection === 'tenantCreate') && (
            <div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const companyName = formData.get('companyName') as string;
                const contactEmail = formData.get('contactEmail') as string;
                const contactPhone = formData.get('contactPhone') as string;
                const domain = formData.get('domain') as string || companyName.toLowerCase().replace(/\s+/g, '');
                
                // Validation
                if (!companyName || !contactEmail) {
                  alert('Company Name and Contact Email are required fields');
                  return;
                }
                
                // Get selected modules from checkboxes
                const selectedModules: string[] = [];
                const checkboxes = e.currentTarget.querySelectorAll('input[type="checkbox"]:checked');
                checkboxes.forEach((cb) => {
                  const moduleName = (cb as HTMLInputElement).value;
                  if (moduleName) selectedModules.push(moduleName);
                });
                
                if (activeSection === 'tenantCreate') {
                  // Create new tenant
                  const newTenant = globalState.addTenant({
                    name: companyName,
                    domain: domain,
                    contactEmail: contactEmail,
                    contactPhone: contactPhone || undefined,
                    status: 'active',
                    modules: selectedModules
                  });
                  alert(`Tenant "${companyName}" created successfully!`);
                  setActiveSection('tenantsList');
                } else {
                  // Update existing tenant (if editing)
                  alert('Tenant updated successfully!');
                  setActiveSection('tenantsList');
                }
              }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Company Data */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Company Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company Name *</label>
                      <input type="text" name="companyName" placeholder="Enter company name" required style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company Address</label>
                      <input type="text" placeholder="Street address" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <input type="text" placeholder="City" style={{
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                      <input type="text" placeholder="State/Province" style={{
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                      <input type="text" placeholder="Postal Code" style={{
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Contact Persons */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Contact Persons</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Primary Contact Name *</label>
                      <input type="text" placeholder="Full name" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Email *</label>
                        <input type="email" name="contactEmail" placeholder="email@company.com" required style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px'
                        }} />
                      </div>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Phone</label>
                        <input type="tel" name="contactPhone" placeholder="+1 (555) 000-0000" style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Locations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Location Name</label>
                      <input type="text" placeholder="e.g., Main Office, Building A" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Location Address</label>
                      <input type="text" placeholder="Physical location address" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Invoicing Data */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Invoicing Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Tax ID</label>
                        <input type="text" placeholder="Tax identification number" style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px'
                        }} />
                      </div>
                      <div>
                        <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>IBAN</label>
                        <input type="text" placeholder="Bank account number" style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(51, 78, 104, 0.5)',
                          border: '1px solid rgba(75, 101, 129, 0.3)',
                          borderRadius: '8px',
                          color: '#d7bb91',
                          fontSize: '14px'
                        }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ color: '#d7bb91', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Billing Email</label>
                      <input type="email" placeholder="billing@company.com" style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(51, 78, 104, 0.5)',
                        border: '1px solid rgba(75, 101, 129, 0.3)',
                        borderRadius: '8px',
                        color: '#d7bb91',
                        fontSize: '14px'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 style={{ color: '#d7bb91', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(75, 101, 129, 0.3)', paddingBottom: '8px' }}>Enabled Features</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="User Management" defaultChecked /> User Management
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="Visitor Management" defaultChecked /> Visitor Management
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="Parking" defaultChecked /> Parking Management
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="Emergency" /> Emergency
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="Ticketing" /> Ticketing
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d7bb91', fontSize: '14px' }}>
                      <input type="checkbox" value="Digital Badge" /> Digital Badges
                    </label>
                  </div>
                </div>

                <button type="submit" style={{
                  backgroundColor: 'rgba(75, 101, 129, 0.8)',
                  color: '#d7bb91',
                  border: '1px solid rgba(75, 101, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '14px 24px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginTop: '8px'
                }}>{activeSection === 'tenantCreate' ? 'Create Tenant' : 'Update Tenant'}</button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* User Add/Edit Modal */}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowUserModal(false); setEditingUser(null); }}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '700px',
            width: '90%',
            border: '1px solid #1E293B',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              {editingUser && 'id' in editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.currentTarget);
              const name = formData.get('name') as string;
              const email = formData.get('email') as string;
              const role = formData.get('role') as string;
              const department = formData.get('department') as string;
              const profileId = formData.get('profileId') as string;
              
              if (!profileId) {
                alert('Please select an access profile');
                return;
              }
              
              if (editingUser && 'id' in editingUser) {
                // Update existing user - find by email match
                const existingUser = globalState.users.find(u => u.email === editingUser.email);
                if (existingUser) {
                  globalState.updateUser(existingUser.id, { name, email, role, department, profileId });
                  alert('User updated successfully!');
                }
              } else {
                // Create new user
                const newUser = globalState.addUser({
                  name,
                  email,
                  role,
                  department,
                  status: 'active',
                  profileId,
                  tenantId: selectedTenant
                });
                
                // Create badge if checkbox is checked
                if (createBadgeForUser) {
                  globalState.addBadge({
                    userId: newUser.id,
                    name,
                    email,
                    company: department || 'N/A',
                    cardType: 'NFC',
                    imei: `IMEI${Date.now()}`,
                    status: 'New'
                  });
                }
                
                alert('User added successfully!' + (createBadgeForUser ? ' Digital badge created.' : ''));
              }
              setShowUserModal(false);
              setEditingUser(null);
              setCreateBadgeForUser(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Full Name *</label>
                <input type="text" name="name" defaultValue={editingUser?.name} required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px'
                }} />
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Email *</label>
                <input type="email" name="email" defaultValue={editingUser?.email} required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px'
                }} />
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Role *</label>
                <select name="role" defaultValue={editingUser?.role || 'User'} required style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Department</label>
                <input type="text" name="department" defaultValue={editingUser?.department} style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                  fontSize: '14px'
                }} />
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Access Profile *</label>
                <select 
                  name="profileId"
                  defaultValue={editingUser?.profileId || ''}
                  required 
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                  <option value="" disabled>Select an access profile</option>
                  {globalState.profiles
                    .filter(p => p.isGlobal || p.tenantId === selectedTenant)
                    .map((profile) => (
                      <option key={profile.id} value={profile.id}>{profile.name} ({profile.modules.length} modules) - {profile.isGlobal ? 'Global' : 'Tenant'}</option>
                    ))}
                </select>
              </div>
              {!(editingUser && 'id' in editingUser) && (
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F1F5F9', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={createBadgeForUser}
                      onChange={(e) => setCreateBadgeForUser(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Create Digital Badge for this user</span>
                  </label>
                  <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px', marginLeft: '24px' }}>A digital badge will be automatically created with NFC card type</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>{editingUser && 'id' in editingUser ? 'Update User' : 'Add User'}</button>
                <button type="button" onClick={() => { setShowUserModal(false); setEditingUser(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Badge Add/Edit Modal */}
      {showBadgeModal && editingBadge && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowBadgeModal(false)}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid #1E293B'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              {editingBadge.id ? 'Edit Badge User' : 'Add New Badge User'}
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveBadgeUser(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Full Name *</label>
                <input 
                  type="text" 
                  value={editingBadge.name}
                  onChange={(e) => setEditingBadge({ ...editingBadge, name: e.target.value })}
                  required 
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Email *</label>
                <input 
                  type="email" 
                  value={editingBadge.email}
                  onChange={(e) => setEditingBadge({ ...editingBadge, email: e.target.value })}
                  required 
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Company *</label>
                <input 
                  type="text" 
                  value={editingBadge.company}
                  onChange={(e) => setEditingBadge({ ...editingBadge, company: e.target.value })}
                  required 
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Card Type *</label>
                <select 
                  value={editingBadge.cardType}
                  onChange={(e) => setEditingBadge({ ...editingBadge, cardType: e.target.value })}
                  required 
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                  <option value="Mifare EV3">Mifare EV3</option>
                  <option value="LEGIC">LEGIC</option>
                  <option value="HID">HID</option>
                  <option value="NFC">NFC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>IMEI Number *</label>
                <input 
                  type="text" 
                  value={editingBadge.imei}
                  onChange={(e) => setEditingBadge({ ...editingBadge, imei: e.target.value })}
                  placeholder="123456789012345"
                  required 
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>{editingBadge.id ? 'Update Badge User' : 'Add Badge User'}</button>
                <button type="button" onClick={() => { setShowBadgeModal(false); setEditingBadge(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Badge Import Modal */}
      {showBadgeImportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowBadgeImportModal(false)}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            border: '1px solid #1E293B'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
              Import Badge Users
            </h2>
            
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>ℹ️</span> CSV Format Requirements
              </h3>
              <p style={{ color: '#F1F5F9', fontSize: '14px', margin: '0 0 12px 0' }}>
                Your CSV file should include the following columns (in order):
              </p>
              <div style={{ fontFamily: 'monospace', backgroundColor: '#1E293B', padding: '12px', borderRadius: '6px', color: '#F1F5F9', fontSize: '12px' }}>
                name,email,company,cardType,imei
              </div>
              <div style={{ marginTop: '12px' }}>
                <button style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.6)',
                  color: '#fff',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }} onClick={() => {
                  const csvContent = "name,email,company,cardType,imei\nJohn Doe,john@company.com,Acme Corp,Mifare EV3,123456789012345\nJane Smith,jane@company.com,TechFlow,NFC,234567890123456"
                  const blob = new Blob([csvContent], { type: 'text/csv' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'badge_users_template.csv'
                  a.click()
                  window.URL.revokeObjectURL(url)
                }}>
                  <ArrowDownloadRegular style={{ fontSize: '14px' }} />
                  Download Sample CSV
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '12px', display: 'block' }}>Upload CSV File</label>
              <div style={{ 
                border: '2px dashed #475569', 
                borderRadius: '12px', 
                padding: '32px', 
                textAlign: 'center',
                backgroundColor: '#1E293B'
              }}>
                <input 
                  type="file" 
                  accept=".csv"
                  onChange={handleBadgeImport}
                  style={{ display: 'none' }}
                  id="badge-csv-upload"
                />
                <label htmlFor="badge-csv-upload" style={{
                  backgroundColor: '#3B82F6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>
                  <ArrowUploadRegular style={{ fontSize: '16px' }} />
                  Choose CSV File
                </label>
                <p style={{ color: '#64748B', marginTop: '12px', fontSize: '14px' }}>
                  Select a CSV file to import multiple badge users at once
                </p>
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
              <h3 style={{ color: '#eab308', fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>⚠️</span> Import Process
              </h3>
              <ul style={{ color: '#F1F5F9', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
                <li>Users will be validated before creation</li>
                <li>Duplicate emails will be reported</li>
                <li>Invalid entries will be flagged</li>
                <li>All imported users will have &quot;New&quot; status</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowBadgeImportModal(false)} style={{
                flex: 1,
                backgroundColor: 'transparent',
                color: '#F1F5F9',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px'
              }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && editingProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowProfileModal(false)}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '700px',
            width: '90%',
            border: '1px solid #1E293B',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              {editingProfile.id ? 'Edit' : 'Create'} Access Profile
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Define which modules this profile can access</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const profileName = formData.get('profileName') as string;
              const description = formData.get('description') as string;
              
              const isGlobalView = selectedTenant === 'all';
              
              if (editingProfile.id) {
                // Update existing profile
                globalState.updateProfile(editingProfile.id, {
                  name: profileName,
                  description: description,
                  modules: editingProfile.modules
                });
                alert('Profile updated successfully');
              } else {
                // Create new profile
                globalState.addProfile({
                  name: profileName,
                  description: description,
                  modules: editingProfile.modules,
                  isGlobal: isGlobalView,
                  tenantId: isGlobalView ? undefined : selectedTenant
                });
                alert('Profile created successfully');
              }
              
              setShowProfileModal(false);
              setEditingProfile(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Profile Name *</label>
                <input 
                  type="text" 
                  name="profileName"
                  defaultValue={editingProfile.name}
                  required 
                  placeholder="e.g., Administrator, Manager, Receptionist"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} 
                />
              </div>
              
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Description *</label>
                <textarea 
                  name="description"
                  defaultValue={editingProfile.description}
                  required 
                  placeholder="Describe the purpose and access level of this profile"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    resize: 'vertical'
                  }} 
                />
              </div>
              
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '12px', display: 'block' }}>Assigned Modules *</label>
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#1E293B', 
                  borderRadius: '8px', 
                  border: '1px solid #475569',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      'User Management', 
                      'Visitor Management', 
                      'Parking', 
                      'Emergency', 
                      'Map', 
                      'Restaurant', 
                      'Ticketing', 
                      'Service Hub', 
                      'Lockers', 
                      'News', 
                      'AI Assistant', 
                      'Space Management', 
                      'Private Delivery',
                      'Authentication',
                      'Reporting'
                    ].map((module) => {
                      const isEnabled = editingProfile.modules.includes(module);
                      return (
                        <label key={module} style={{
                          padding: '10px',
                          backgroundColor: '#0F1629',
                          borderRadius: '6px',
                          border: `1px solid ${isEnabled ? '#10B981' : '#475569'}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}>
                          <input 
                            type="checkbox" 
                            checked={isEnabled}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditingProfile({
                                  ...editingProfile,
                                  modules: [...editingProfile.modules, module]
                                });
                              } else {
                                setEditingProfile({
                                  ...editingProfile,
                                  modules: editingProfile.modules.filter(m => m !== module)
                                });
                              }
                            }}
                            style={{ accentColor: '#10B981', cursor: 'pointer' }} 
                          />
                          <span style={{ color: '#F1F5F9', fontSize: '13px' }}>{module}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <p style={{ color: '#64748B', fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>Selected: {editingProfile.modules.length} module(s)</p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>{editingProfile.id ? 'Update Profile' : 'Create Profile'}</button>
                <button type="button" onClick={() => { setShowProfileModal(false); setEditingProfile(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parking Space Modal */}
      {showParkingModal && editingParkingSpace && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowParkingModal(false); setEditingParkingSpace(null); }}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '800px',
            width: '90%',
            border: '1px solid #1E293B',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              {editingParkingSpace.id ? 'Edit' : 'Create'} Parking Space
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Configure parking space details and features</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              const parkingData = {
                spaceNumber: formData.get('spaceNumber') as string,
                name: formData.get('name') as string,
                building: formData.get('building') as string,
                location: formData.get('location') as string,
                level: formData.get('level') as string,
                floor: formData.get('floor') as string,
                isElectric: formData.get('isElectric') === 'on',
                isDisabled: formData.get('isDisabled') === 'on',
                isSpecialNeed: formData.get('isSpecialNeed') === 'on',
                isVIP: formData.get('isVIP') === 'on',
                isReservedForVisitor: formData.get('isReservedForVisitor') === 'on',
                notes: formData.get('notes') as string,
                tenantId: selectedTenant,
                status: 'available' as const
              };
              
              if (editingParkingSpace.id) {
                // Update existing parking space
                globalState.updateParkingSpace(editingParkingSpace.id, parkingData);
                alert('Parking space updated successfully');
              } else {
                // Create new parking space
                globalState.addParkingSpace(parkingData);
                alert('Parking space created successfully');
              }
              
              setShowParkingModal(false);
              setEditingParkingSpace(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Space Number *</label>
                  <input 
                    type="text" 
                    name="spaceNumber"
                    defaultValue={editingParkingSpace.spaceNumber}
                    required 
                    placeholder="e.g., A-101, B2-045"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                  />
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Friendly Name</label>
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={editingParkingSpace.name}
                    placeholder="e.g., Executive Parking, Visitor Spot 1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Building *</label>
                  <select
                    name="building"
                    defaultValue={editingParkingSpace.building}
                    required
                    onChange={(e) => setSelectedParkingBuilding(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select a building</option>
                    {globalState.buildings.filter(b => b.tenantId === selectedTenant).map(building => (
                      <option key={building.id} value={building.name}>{building.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Floor *</label>
                  <select
                    name="floor"
                    defaultValue={editingParkingSpace.floor}
                    required
                    disabled={!selectedParkingBuilding && !editingParkingSpace.building}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer',
                      opacity: (!selectedParkingBuilding && !editingParkingSpace.building) ? 0.5 : 1
                    }}
                  >
                    <option value="">Select a floor</option>
                    {(() => {
                      const buildingName = selectedParkingBuilding || editingParkingSpace.building;
                      const building = globalState.buildings.find(b => b.name === buildingName && b.tenantId === selectedTenant);
                      if (!building) return null;
                      return building.floors.map(floor => (
                        <option key={floor.floorNumber} value={floor.floorLabel}>{floor.floorLabel === 'Ground' ? 'Ground Floor' : `Floor ${floor.floorLabel}`}</option>
                      ));
                    })()}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Location *</label>
                  <input 
                    type="text" 
                    name="location"
                    defaultValue={editingParkingSpace.location}
                    required 
                    placeholder="e.g., North Wing, Underground Garage"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                  />
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Level</label>
                  <input 
                    type="text" 
                    name="level"
                    defaultValue={editingParkingSpace.level}
                    placeholder="e.g., Level 1, Ground, Basement"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '12px', display: 'block' }}>Space Features</label>
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#1E293B', 
                  borderRadius: '8px', 
                  border: '1px solid #475569'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#F1F5F9'
                    }}>
                      <input 
                        type="checkbox" 
                        name="isElectric"
                        defaultChecked={editingParkingSpace.isElectric}
                        style={{ accentColor: '#10B981', cursor: 'pointer', width: '18px', height: '18px' }} 
                      />
                      <span style={{ fontSize: '14px' }}>⚡ Electric Vehicle Charging</span>
                    </label>
                    
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#F1F5F9'
                    }}>
                      <input 
                        type="checkbox" 
                        name="isDisabled"
                        defaultChecked={editingParkingSpace.isDisabled}
                        style={{ accentColor: '#3B82F6', cursor: 'pointer', width: '18px', height: '18px' }} 
                      />
                      <span style={{ fontSize: '14px' }}>♿ Disabled Access</span>
                    </label>
                    
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#F1F5F9'
                    }}>
                      <input 
                        type="checkbox" 
                        name="isSpecialNeed"
                        defaultChecked={editingParkingSpace.isSpecialNeed}
                        style={{ accentColor: '#8B5CF6', cursor: 'pointer', width: '18px', height: '18px' }} 
                      />
                      <span style={{ fontSize: '14px' }}>Special Needs</span>
                    </label>
                    
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#F1F5F9'
                    }}>
                      <input 
                        type="checkbox" 
                        name="isVIP"
                        defaultChecked={editingParkingSpace.isVIP}
                        style={{ accentColor: '#F59E0B', cursor: 'pointer', width: '18px', height: '18px' }} 
                      />
                      <span style={{ fontSize: '14px' }}>⭐ VIP / Executive</span>
                    </label>
                    
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#F1F5F9'
                    }}>
                      <input 
                        type="checkbox" 
                        name="isReservedForVisitor"
                        defaultChecked={editingParkingSpace.isReservedForVisitor}
                        style={{ accentColor: '#EC4899', cursor: 'pointer', width: '18px', height: '18px' }} 
                      />
                      <span style={{ fontSize: '14px' }}>Reserved for Visitors</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Additional Notes</label>
                <textarea 
                  name="notes"
                  defaultValue={editingParkingSpace.notes}
                  placeholder="Any additional information about this parking space..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    resize: 'vertical'
                  }} 
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>{editingParkingSpace.id ? 'Update Parking Space' : 'Create Parking Space'}</button>
                <button type="button" onClick={() => { setShowParkingModal(false); setEditingParkingSpace(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Locker Modal */}
      {showLockerModal && editingLocker && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowLockerModal(false); setEditingLocker(null); }}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '700px',
            width: '90%',
            border: '1px solid #1E293B',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              {editingLocker.id ? 'Edit' : 'Create'} Locker
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Configure locker details and assignment</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              const lockerData = {
                lockerNumber: formData.get('lockerNumber') as string,
                name: formData.get('name') as string,
                building: formData.get('building') as string,
                floor: formData.get('floor') as string,
                zone: formData.get('zone') as string,
                type: formData.get('type') as 'permanent' | 'gym' | 'bike' | 'temporary' | 'storage',
                notes: formData.get('notes') as string,
                tenantId: selectedTenant,
                status: 'available' as const
              };
              
              if (editingLocker.id) {
                // Update existing locker
                globalState.updateLocker(editingLocker.id, lockerData);
                alert('Locker updated successfully');
              } else {
                // Create new locker
                globalState.addLocker(lockerData);
                alert('Locker created successfully');
              }
              
              setShowLockerModal(false);
              setEditingLocker(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Locker Number *</label>
                  <input 
                    type="text" 
                    name="lockerNumber"
                    defaultValue={editingLocker.lockerNumber}
                    required 
                    placeholder="e.g., L-101, GYM-045"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                  />
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Friendly Name</label>
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={editingLocker.name}
                    placeholder="e.g., Executive Locker, Bike Storage 1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Building *</label>
                  <select
                    name="building"
                    defaultValue={editingLocker.building}
                    required
                    onChange={(e) => setSelectedLockerBuilding(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select a building</option>
                    {globalState.buildings.filter(b => b.tenantId === selectedTenant).map(building => (
                      <option key={building.id} value={building.name}>{building.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Floor *</label>
                  <select
                    name="floor"
                    defaultValue={editingLocker.floor}
                    required
                    disabled={!selectedLockerBuilding && !editingLocker.building}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer',
                      opacity: (!selectedLockerBuilding && !editingLocker.building) ? 0.5 : 1
                    }}
                  >
                    <option value="">Select a floor</option>
                    {(() => {
                      const buildingName = selectedLockerBuilding || editingLocker.building;
                      const building = globalState.buildings.find(b => b.name === buildingName && b.tenantId === selectedTenant);
                      if (!building) return null;
                      return building.floors.map(floor => (
                        <option key={floor.floorNumber} value={floor.floorLabel}>{floor.floorLabel === 'Ground' ? 'Ground Floor' : `Floor ${floor.floorLabel}`}</option>
                      ));
                    })()}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Zone</label>
                  <select
                    name="zone"
                    defaultValue={editingLocker.zone}
                    disabled={!selectedLockerBuilding && !editingLocker.building}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer',
                      opacity: (!selectedLockerBuilding && !editingLocker.building) ? 0.5 : 1
                    }}
                  >
                    <option value="">Select a zone (optional)</option>
                    {(() => {
                      const buildingName = selectedLockerBuilding || editingLocker.building;
                      const building = globalState.buildings.find(b => b.name === buildingName && b.tenantId === selectedTenant);
                      if (!building) return null;
                      const allZones = building.floors.flatMap(f => f.zones);
                      const uniqueZones = Array.from(new Set(allZones));
                      return uniqueZones.map(zone => (
                        <option key={zone} value={zone}>{zone}</option>
                      ));
                    })()}
                  </select>
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Locker Type *</label>
                  <select 
                    name="type"
                    defaultValue={editingLocker.type}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }} 
                  >
                    <option value="permanent">Permanent</option>
                    <option value="gym">Gym</option>
                    <option value="bike">Bike</option>
                    <option value="temporary">Temporary</option>
                    <option value="storage">Storage</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Additional Notes</label>
                <textarea 
                  name="notes"
                  defaultValue={editingLocker.notes}
                  placeholder="Any additional information about this locker..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    resize: 'vertical'
                  }} 
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>{editingLocker.id ? 'Update Locker' : 'Create Locker'}</button>
                <button type="button" onClick={() => { setShowLockerModal(false); setEditingLocker(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Space Modal */}
      {showSpaceModal && editingSpace && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowSpaceModal(false); setEditingSpace(null); }}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '700px',
            width: '90%',
            border: '1px solid #1E293B',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              {editingSpace.id ? 'Edit' : 'Create'} Space
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Configure space details and assignment</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              const spaceData = {
                spaceNumber: formData.get('spaceNumber') as string,
                name: formData.get('name') as string,
                building: formData.get('building') as string,
                floor: formData.get('floor') as string,
                location: formData.get('location') as string,
                zone: formData.get('zone') as string,
                type: formData.get('type') as 'desk' | 'office' | 'meeting-room' | 'conference-room' | 'social-hub',
                capacity: parseInt(formData.get('capacity') as string) || 1,
                notes: formData.get('notes') as string,
                tenantId: selectedTenant,
                status: 'available' as const
              };
              
              if (editingSpace.id) {
                // Update existing space
                globalState.updateSpace(editingSpace.id, spaceData);
                alert('Space updated successfully');
              } else {
                // Create new space
                globalState.addSpace(spaceData);
                alert('Space created successfully');
              }
              
              setShowSpaceModal(false);
              setEditingSpace(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Space Number *</label>
                  <input 
                    type="text" 
                    name="spaceNumber"
                    defaultValue={editingSpace.spaceNumber}
                    required 
                    placeholder="e.g., DSK-101, OFF-205"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                  />
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Friendly Name</label>
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={editingSpace.name}
                    placeholder="e.g., Corner Office, Blue Desk"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Building *</label>
                  <select
                    name="building"
                    defaultValue={editingSpace.building}
                    required
                    onChange={(e) => setSelectedSpaceBuilding(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select a building</option>
                    {globalState.buildings.filter(b => b.tenantId === selectedTenant).map(building => (
                      <option key={building.id} value={building.name}>{building.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Floor *</label>
                  <select
                    name="floor"
                    defaultValue={editingSpace.floor}
                    required
                    disabled={!selectedSpaceBuilding && !editingSpace.building}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer',
                      opacity: (!selectedSpaceBuilding && !editingSpace.building) ? 0.5 : 1
                    }}
                  >
                    <option value="">Select a floor</option>
                    {(() => {
                      const buildingName = selectedSpaceBuilding || editingSpace.building;
                      const building = globalState.buildings.find(b => b.name === buildingName && b.tenantId === selectedTenant);
                      if (!building) return null;
                      return building.floors.map(floor => (
                        <option key={floor.floorNumber} value={floor.floorLabel}>{floor.floorLabel === 'Ground' ? 'Ground Floor' : `Floor ${floor.floorLabel}`}</option>
                      ));
                    })()}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Location</label>
                  <input 
                    type="text" 
                    name="location"
                    defaultValue={editingSpace.location}
                    placeholder="e.g., East Wing, Near Reception"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                  />
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Zone</label>
                  <select
                    name="zone"
                    defaultValue={editingSpace.zone}
                    disabled={!selectedSpaceBuilding && !editingSpace.building}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer',
                      opacity: (!selectedSpaceBuilding && !editingSpace.building) ? 0.5 : 1
                    }}
                  >
                    <option value="">Select a zone (optional)</option>
                    {(() => {
                      const buildingName = selectedSpaceBuilding || editingSpace.building;
                      const building = globalState.buildings.find(b => b.name === buildingName && b.tenantId === selectedTenant);
                      if (!building) return null;
                      const allZones = building.floors.flatMap(f => f.zones);
                      const uniqueZones = Array.from(new Set(allZones));
                      return uniqueZones.map(zone => (
                        <option key={zone} value={zone}>{zone}</option>
                      ));
                    })()}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Space Type *</label>
                  <select 
                    name="type"
                    defaultValue={editingSpace.type}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }} 
                  >
                    <option value="desk">Desk</option>
                    <option value="office">Office</option>
                    <option value="meeting-room">Meeting Room</option>
                    <option value="conference-room">Conference Room</option>
                    <option value="social-hub">Social Hub</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Capacity *</label>
                  <input 
                    type="number" 
                    name="capacity"
                    defaultValue={editingSpace.capacity}
                    required 
                    min="1"
                    placeholder="Number of people"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Additional Notes</label>
                <textarea 
                  name="notes"
                  defaultValue={editingSpace.notes}
                  placeholder="Any additional information about this space..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    resize: 'vertical'
                  }} 
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>{editingSpace.id ? 'Update Space' : 'Create Space'}</button>
                <button type="button" onClick={() => { setShowSpaceModal(false); setEditingSpace(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Building Modal */}
      {showBuildingModal && editingBuilding && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowBuildingModal(false); setEditingBuilding(null); setSelectedFloorForZones(null); }}>
          <div style={{
            backgroundColor: '#162032',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '900px',
            width: '90%',
            border: '1px solid #1E293B',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              {editingBuilding.id ? 'Edit' : 'Create'} Building
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>Configure building structure with floors and zones</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              const name = formData.get('name') as string;
              const basementLevels = parseInt(formData.get('basementLevels') as string) || 0;
              const topFloor = parseInt(formData.get('topFloor') as string) || 1;
              
              // Generate floors array
              const floors = [];
              
              // Add basement floors
              for (let i = -basementLevels; i < 0; i++) {
                const floorLabel = `B${Math.abs(i)}`;
                const zonesInput = formData.get(`zones_${i}`) as string;
                const zones = zonesInput ? zonesInput.split(',').map(z => z.trim()).filter(z => z) : ['Zone A'];
                floors.push({
                  floorNumber: i,
                  floorLabel,
                  zones
                });
              }
              
              // Add ground floor
              const groundZonesInput = formData.get('zones_0') as string;
              const groundZones = groundZonesInput ? groundZonesInput.split(',').map(z => z.trim()).filter(z => z) : ['Lobby'];
              floors.push({
                floorNumber: 0,
                floorLabel: 'Ground',
                zones: groundZones
              });
              
              // Add upper floors
              for (let i = 1; i <= topFloor; i++) {
                const floorLabel = `${i}`;
                const zonesInput = formData.get(`zones_${i}`) as string;
                const zones = zonesInput ? zonesInput.split(',').map(z => z.trim()).filter(z => z) : ['Zone A'];
                floors.push({
                  floorNumber: i,
                  floorLabel,
                  zones
                });
              }
              
              const buildingData = {
                name,
                tenantId: selectedTenant,
                basementLevels,
                topFloor,
                floors
              };
              
              if (editingBuilding.id) {
                // Update existing building
                globalState.updateBuilding(editingBuilding.id, buildingData);
                alert('Building updated successfully');
              } else {
                // Create new building
                globalState.addBuilding(buildingData);
                alert('Building created successfully');
              }
              
              setShowBuildingModal(false);
              setEditingBuilding(null);
              setSelectedFloorForZones(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Building Name *</label>
                <input 
                  type="text" 
                  name="name"
                  defaultValue={editingBuilding.name}
                  required 
                  placeholder="e.g., Building A, Main Tower"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '14px'
                  }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Basement Levels</label>
                  <input 
                    type="number" 
                    name="basementLevels"
                    defaultValue={editingBuilding.basementLevels}
                    min="0"
                    max="10"
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setEditingBuilding(prev => prev ? {...prev, basementLevels: val} : null);
                    }}
                  />
                  <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>Number of basement floors (e.g., 2 = B2, B1)</p>
                </div>
                
                <div>
                  <label style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>Top Floor *</label>
                  <input 
                    type="number" 
                    name="topFloor"
                    defaultValue={editingBuilding.topFloor}
                    required 
                    min="1"
                    max="100"
                    placeholder="10"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                      fontSize: '14px'
                    }} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setEditingBuilding(prev => prev ? {...prev, topFloor: val} : null);
                    }}
                  />
                  <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>Highest floor number</p>
                </div>
              </div>

              {/* Floor Zone Configuration */}
              <div style={{
                backgroundColor: '#0F1629',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #1E293B'
              }}>
                <h4 style={{ color: '#F1F5F9', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Zone Configuration</h4>
                <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '16px' }}>Define zones for each floor (comma-separated, e.g., &quot;Zone A, Zone B, Zone C&quot;)</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflow: 'auto', padding: '4px' }}>
                  {/* Basement floors */}
                  {Array.from({ length: editingBuilding.basementLevels }, (_, i) => {
                    const floorNum = -(editingBuilding.basementLevels - i);
                    const floorLabel = `B${Math.abs(floorNum)}`;
                    return (
                      <div key={floorNum} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ color: '#8B5CF6', fontSize: '14px', fontWeight: '600', minWidth: '80px' }}>{floorLabel}</span>
                        <input 
                          type="text" 
                          name={`zones_${floorNum}`}
                          defaultValue="Parking, Storage"
                          placeholder="Parking, Storage"
                          style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#1E293B',
                            border: '1px solid #475569',
                            borderRadius: '6px',
                            color: '#F1F5F9',
                            fontSize: '13px'
                          }} 
                        />
                      </div>
                    );
                  })}
                  
                  {/* Ground floor */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#10B981', fontSize: '14px', fontWeight: '600', minWidth: '80px' }}>Ground</span>
                    <input 
                      type="text" 
                      name="zones_0"
                      defaultValue="Lobby, Reception, Security"
                      placeholder="Lobby, Reception"
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#1E293B',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        color: '#F1F5F9',
                        fontSize: '13px'
                      }} 
                    />
                  </div>
                  
                  {/* Upper floors */}
                  {Array.from({ length: editingBuilding.topFloor }, (_, i) => {
                    const floorNum = i + 1;
                    return (
                      <div key={floorNum} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ color: '#3B82F6', fontSize: '14px', fontWeight: '600', minWidth: '80px' }}>Floor {floorNum}</span>
                        <input 
                          type="text" 
                          name={`zones_${floorNum}`}
                          defaultValue="Zone A, Zone B"
                          placeholder="Zone A, Zone B"
                          style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#1E293B',
                            border: '1px solid #475569',
                            borderRadius: '6px',
                            color: '#F1F5F9',
                            fontSize: '13px'
                          }} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                }}>{editingBuilding.id ? 'Update Building' : 'Create Building'}</button>
                <button type="button" onClick={() => { setShowBuildingModal(false); setEditingBuilding(null); setSelectedFloorForZones(null); }} style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: '#F1F5F9',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
