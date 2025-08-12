import React from 'react'

interface WaifuDownloaderLogoProps {
  className?: string
  size?: number
}

export const WaifuDownloaderLogo: React.FC<WaifuDownloaderLogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="hsl(var(--primary) / 0.1)" />

      {/* Stylized 'W' */}
      <path
        d="M25 25 L40 75 L50 50 L60 75 L75 25"
        stroke="hsl(var(--primary))"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Download arrow */}
      <path
        d="M50 60 L50 85 M40 75 L50 85 L60 75"
        stroke="hsl(var(--primary))"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Anime-style eye */}
      <circle cx="50" cy="35" r="6" fill="hsl(var(--primary))" />
      <path
        d="M44 32 Q50 38 56 32"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}
