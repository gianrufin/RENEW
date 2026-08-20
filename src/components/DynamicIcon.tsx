import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const LucideIcon = (Icons as any)[name] || Icons.CheckCircle2;
  return <LucideIcon className={className} />;
};
