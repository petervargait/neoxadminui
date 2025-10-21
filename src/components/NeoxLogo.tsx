interface NeoxLogoProps {
  width?: string;
  height?: string;
}

export default function NeoxLogo({ width = '300px', height = '80px' }: NeoxLogoProps) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <img 
        src="/neox-logo.png" 
        alt="NEOX INFINITY Logo" 
        style={{
          width: width,
          height: height,
          objectFit: 'contain',
          filter: 'brightness(1.1) contrast(1.1)'
        }}
        onError={(e) => {
          // Fallback to styled div if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.style.cssText = `
            width: ${width};
            height: ${height};
            background: linear-gradient(45deg, #d7bb91, #c9a876);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: bold;
            color: #08122e;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            box-shadow: 0 4px 12px rgba(215, 187, 145, 0.3);
          `;
          fallback.textContent = 'NEOX INFINITY';
          target.parentNode?.appendChild(fallback);
        }}
      />
    </div>
  )
}
