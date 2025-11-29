import React from 'react';
import { Flame } from 'lucide-react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const iconSize = size === 'sm' ? 20 : size === 'md' ? 28 : 40;
  const textSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-4xl';
  const gap = size === 'sm' ? 'gap-2' : 'gap-3';

  return (
    <div className={`flex items-center ${gap} font-bold select-none`}>
      <div className="relative">
        <Flame size={iconSize} className="text-[#FF8C00] fill-orange-500 animate-pulse" />
        <div className="absolute inset-0 bg-orange-500 blur-lg opacity-20 rounded-full"></div>
      </div>
      <span className={`${textSize} tracking-tight text-white`}>
        Viral<span className="text-[#FF8C00]">Copy</span> AI
      </span>
    </div>
  );
};