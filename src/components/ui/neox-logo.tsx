'use client'

import { cn } from '@/lib/utils'

interface NEOXLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'gold' | 'white'
}

export function NEOXLogo({ className, size = 'md', variant = 'default' }: NEOXLogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  }

  const colorClasses = {
    default: 'text-primary',
    gold: 'text-gold-600',
    white: 'text-white'
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg
        className={cn(sizeClasses[size], colorClasses[variant])}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* NEOX geometric logo - abstract building/infinity shape */}
        <g fill="currentColor">
          {/* Main building structure */}
          <rect x="10" y="70" width="8" height="30" />
          <rect x="22" y="60" width="8" height="40" />
          <rect x="34" y="45" width="8" height="55" />
          <rect x="46" y="35" width="8" height="65" />
          <rect x="58" y="45" width="8" height="55" />
          <rect x="70" y="60" width="8" height="40" />
          <rect x="82" y="70" width="8" height="30" />
          
          {/* Connecting elements - infinity symbol inspiration */}
          <path d="M25 50 Q50 30 75 50 Q50 70 25 50" stroke="currentColor" strokeWidth="2" fill="none" />
          
          {/* Base line */}
          <rect x="10" y="98" width="80" height="2" />
          
          {/* Top accent */}
          <circle cx="50" cy="25" r="3" />
        </g>
      </svg>
      <div className={cn('flex flex-col', colorClasses[variant])}>
        <span className="text-xl font-bold tracking-tight">NEOX</span>
        <span className="text-xs font-medium opacity-80">INFINITY</span>
      </div>
    </div>
  )
}

export function NEOXLogoIcon({ className, size = 'md', variant = 'default' }: NEOXLogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  }

  const colorClasses = {
    default: 'text-primary',
    gold: 'text-gold-600',
    white: 'text-white'
  }

  return (
    <svg
      className={cn(sizeClasses[size], colorClasses[variant], className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <rect x="10" y="70" width="8" height="30" />
        <rect x="22" y="60" width="8" height="40" />
        <rect x="34" y="45" width="8" height="55" />
        <rect x="46" y="35" width="8" height="65" />
        <rect x="58" y="45" width="8" height="55" />
        <rect x="70" y="60" width="8" height="40" />
        <rect x="82" y="70" width="8" height="30" />
        <path d="M25 50 Q50 30 75 50 Q50 70 25 50" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="10" y="98" width="80" height="2" />
        <circle cx="50" cy="25" r="3" />
      </g>
    </svg>
  )
}
