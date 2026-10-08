import React from 'react';
import { BrandLogo } from './BrandLogo';
import { BrandIcon } from './BrandIcon';

export interface ResponsiveBrandProps {
  isCollapsed?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  logoClassName?: string;
  iconClassName?: string;
  onClick?: () => void;
  alt?: string;
  mobileIconOnly?: boolean;
}

/**
 * Responsive Brand Switcher:
 * - When isCollapsed is true: renders BrandIcon (/logo/icon.png)
 * - By default: renders full Wordmark (BrandLogo) across all screen sizes
 * - If mobileIconOnly is true: renders compact App Icon on mobile, BrandLogo on desktop
 */
export const ResponsiveBrand: React.FC<ResponsiveBrandProps> = ({
  isCollapsed = false,
  theme = 'auto',
  logoClassName = 'h-8 sm:h-9 w-auto',
  iconClassName = 'w-8 h-8',
  onClick,
  alt = 'ApnaTrip',
  mobileIconOnly = false,
}) => {
  if (isCollapsed) {
    return <BrandIcon className={iconClassName} onClick={onClick} alt={alt} />;
  }

  if (mobileIconOnly) {
    return (
      <div className="flex items-center cursor-pointer" onClick={onClick}>
        {/* Mobile Icon */}
        <div className="block md:hidden">
          <BrandIcon className={iconClassName} alt={alt} />
        </div>

        {/* Desktop Full Wordmark */}
        <div className="hidden md:block">
          <BrandLogo theme={theme} className={logoClassName} alt={alt} />
        </div>
      </div>
    );
  }

  return (
    <BrandLogo
      theme={theme}
      className={logoClassName}
      onClick={onClick}
      alt={alt}
    />
  );
};
