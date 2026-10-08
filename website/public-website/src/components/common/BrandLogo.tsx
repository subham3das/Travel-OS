import React from 'react';
import { useTheme } from '../../theme/useTheme';

export interface BrandLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  forceTheme?: 'Light' | 'Dark';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  forceTheme,
  className = 'h-8 w-auto',
  alt = 'ApnaTrip',
  style,
  ...rest
}) => {
  const { isDark } = useTheme();

  // In light theme, background is light (#F8FAFC), so logo-light.png (which has dark text) is used.
  // In dark theme, background is dark (#0F172A), so logo-dark.png (which has white text) is used.
  const activeIsDark = forceTheme ? forceTheme === 'Dark' : isDark;
  const logoSrc = activeIsDark ? '/logo/logo-dark.png' : '/logo/logo-light.png';

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`object-contain select-none transition-opacity duration-300 ${className}`}
      style={{
        maxHeight: '100%',
        ...style,
      }}
      loading="eager"
      decoding="async"
      {...rest}
    />
  );
};

export default BrandLogo;
