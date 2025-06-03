import React from 'react';

interface IconProps {
  className?: string;
}

const BotIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative rounded-full overflow-hidden bg-white ${className}`}>
      <img src="/logo.svg" alt="Savr Bot Logo" className="object-contain w-full h-full" />
    </div>
  );
};

export default BotIcon;