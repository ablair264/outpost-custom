import React, { ReactNode } from 'react';

interface NavButtonProps {
  children: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: 'default' | 'primary';
  className?: string;
  delay?: number;
}

const NavButton: React.FC<NavButtonProps> = ({
  children,
  href,
  onClick,
  icon,
  variant = 'default',
  className = '',
  delay = 0
}) => {
  const baseStyles = `
    p-2.5
    rounded-[3px]
    shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
    inline-flex
    justify-center
    items-center
    gap-2.5
    text-center
    text-white
    text-base
    font-bold
    font-['Montserrat']
    transition-all
    duration-300
    ease-out
    cursor-pointer
    select-none
    animate-fadeIn
    opacity-0
  `;

  const animationDelay = { animationDelay: `${delay}ms`, animationFillMode: 'forwards' as const };

  // Default state styles
  const defaultStyles = variant === 'primary'
    ? `
      bg-gradient-to-br from-lime-600/20 to-lime-700/30
      outline outline-1 outline-offset-[-0.50px] outline-lime-600
    `
    : `
      bg-gradient-to-br from-zinc-900/10 to-black/20
      outline outline-1 outline-offset-[-0.50px] outline-lime-600
    `;

  // Hover state styles
  const hoverStyles = `
    hover:bg-gradient-to-br hover:from-zinc-900/20 hover:to-black/30
    hover:outline-[5px] hover:outline-offset-[-2.50px] hover:outline-stone-900/60
    hover:scale-[1.02]
  `;

  // Active/Pressed state styles
  const activeStyles = `
    active:bg-gradient-to-br active:from-zinc-900/5 active:to-black/10
    active:outline-4 active:outline-offset-[-2px] active:outline-lime-500
    active:scale-[0.98]
  `;

  const combinedStyles = `${baseStyles} ${defaultStyles} ${hoverStyles} ${activeStyles} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={combinedStyles} style={animationDelay}>
        <span>{children}</span>
        {icon && <span className="flex-shrink-0">{icon}</span>}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedStyles} style={animationDelay}>
      <span>{children}</span>
      {icon && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};

export default NavButton;
