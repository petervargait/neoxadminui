interface NeoxLogoProps {
  width?: string;
  height?: string;
  color?: string;
}

export default function NeoxLogo({ width = '64px', height = '64px', color = '#d7bb91' }: NeoxLogoProps) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      color: color 
    }}>
      <svg style={{ width, height }} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main building structures */}
        <g fill={color}>
          {/* Base line */}
          <rect x="20" y="90" width="160" height="3" />
          
          {/* Left building */}
          <rect x="30" y="40" width="3" height="50" />
          <rect x="35" y="45" width="3" height="45" />
          <rect x="40" y="50" width="3" height="40" />
          
          {/* Center building complex */}
          <rect x="55" y="25" width="4" height="65" />
          <rect x="62" y="30" width="4" height="60" />
          <rect x="69" y="20" width="5" height="70" />
          <rect x="77" y="15" width="5" height="75" />
          <rect x="85" y="20" width="5" height="70" />
          <rect x="93" y="30" width="4" height="60" />
          <rect x="100" y="25" width="4" height="65" />
          
          {/* Right building complex */}
          <rect x="115" y="35" width="4" height="55" />
          <rect x="122" y="40" width="4" height="50" />
          <rect x="129" y="45" width="3" height="45" />
          <rect x="135" y="50" width="3" height="40" />
          <rect x="140" y="55" width="3" height="35" />
          
          {/* Far right buildings */}
          <rect x="150" y="60" width="3" height="30" />
          <rect x="155" y="65" width="3" height="25" />
          <rect x="160" y="70" width="3" height="20" />
          
          {/* Connecting elements and details */}
          <rect x="45" y="55" width="8" height="2" />
          <rect x="105" y="45" width="8" height="2" />
          <rect x="125" y="60" width="6" height="2" />
          
          {/* Windows/details on main buildings */}
          <rect x="71" y="30" width="1" height="2" />
          <rect x="71" y="35" width="1" height="2" />
          <rect x="71" y="40" width="1" height="2" />
          <rect x="79" y="25" width="1" height="2" />
          <rect x="79" y="30" width="1" height="2" />
          <rect x="79" y="35" width="1" height="2" />
          <rect x="87" y="30" width="1" height="2" />
          <rect x="87" y="35" width="1" height="2" />
          <rect x="87" y="40" width="1" height="2" />
        </g>
      </svg>
      <div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>NEOX</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>INFINITY</div>
      </div>
    </div>
  )
}