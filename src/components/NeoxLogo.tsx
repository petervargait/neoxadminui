interface NeoxLogoProps {
  width?: string;
  height?: string;
}

export default function NeoxLogo({ width = '200px', height = '80px' }: NeoxLogoProps) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '12px'
    }}>
      <div style={{
        width: width,
        height: height,
        background: 'linear-gradient(45deg, #d7bb91, #c9a876)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#08122e',
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        boxShadow: '0 4px 12px rgba(215, 187, 145, 0.3)'
      }}>
        NEOX INFINITY
      </div>
    </div>
  )
}
