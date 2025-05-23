
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  color?: string;
  className?: string;
}

export function Logo({ size = 'md', showText = true, color = 'text-amber-500', className = '' }: LogoProps) {
  // Size classes mapping
  const sizeClasses = {
    sm: 'h-3 w-5',
    md: 'h-6 w-8',
    lg: 'h-10 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <img
          src="./logo.svg"
          alt="Savr AI Logo"
          className={`${sizeClasses[size]}`}
        />
      </div>
      {showText && (
        <span className={`font-serif ${color} ${textSizeClasses[size]}`}>
          Savr AI
        </span>
      )}
    </div>
  );
}
