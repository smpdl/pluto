import React from 'react';

interface PlutoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PlutoLogo({ className = '', size = 'md' }: PlutoLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 transition-transform duration-200 hover:scale-105 ${className}`}>
      {/* Icon Container */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Main Circle */}
        <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center relative overflow-hidden">
          {/* Crescent Moon */}
          <div className="absolute left-0 top-0 w-full h-full bg-blue-600 rounded-full transform -translate-x-1/2 animate-pulse">
            <div className="w-full h-full bg-yellow-50 rounded-full transform translate-x-1/2"></div>
          </div>
          
          {/* Smiling Face */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex space-x-1 mb-1">
              <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
            </div>
            {/* Smile */}
            <div className="w-2 h-1 border-b-2 border-blue-600 rounded-full"></div>
          </div>
        </div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 blur-sm animate-pulse"></div>
      </div>
      
      {/* Text */}
      <div className="flex items-center">
        <span className={`font-bold text-blue-600 ${textSizes[size]}`}>
          Pluto
        </span>
        <div className="ml-1 px-1.5 py-0.5 bg-blue-600 rounded text-white text-xs font-medium animate-bounce">
          AI
        </div>
      </div>
    </div>
  );
}
