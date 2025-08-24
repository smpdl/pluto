import React from 'react';

interface PlutoLogoImageProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PlutoLogoImage({ className = '', size = 'md' }: PlutoLogoImageProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/pluto-logo.svg" 
        alt="Pluto AI Logo" 
        className={`${sizeClasses[size]} w-auto transition-transform duration-200 hover:scale-105`}
      />
    </div>
  );
}
