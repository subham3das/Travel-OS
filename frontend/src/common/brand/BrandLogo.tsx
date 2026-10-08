import React, { useState, useLayoutEffect, useRef } from 'react';
import { useBrandTheme, BrandThemeMode } from './useBrandTheme';

export interface BrandLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  alt?: string;
  onClick?: () => void;
}

/**
 * Helper to determine background brightness by walking up the DOM tree.
 * Prevents rendering light/white text on light backgrounds or dark text on dark backgrounds.
 */
function detectParentBackgroundBrightness(element: HTMLElement | null): 'light' | 'dark' | null {
  if (typeof window === 'undefined' || !element) return null;
  let curr = element.parentElement;
  while (curr && curr !== document.documentElement) {
    const style = window.getComputedStyle(curr);
    const bg = style.backgroundColor;
    if (bg && bg !== 'transparent' && !bg.startsWith('rgba(0, 0, 0, 0)')) {
      const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
        // Ignore almost transparent backgrounds
        if (a > 0.35) {
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          return brightness < 128 ? 'dark' : 'light';
        }
      }
    }
    curr = curr.parentElement;
  }
  return null;
}

/**
 * ApnaTrip Centralized Wordmark Component
 * Automatically switches between /logo/logo-light.png and /logo/logo-dark.png
 * based on container surface brightness, active theme, or explicit theme prop.
 * Preserves aspect ratio, never stretches, and eliminates invisible logos.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  theme = 'auto',
  className = 'h-8 w-auto',
  alt = 'ApnaTrip',
  onClick,
  style,
  ...restProps
}) => {
  const globalTheme: BrandThemeMode = useBrandTheme(theme);
  const imgRef = useRef<HTMLImageElement>(null);
  const [containerTheme, setContainerTheme] = useState<'light' | 'dark' | null>(null);

  useLayoutEffect(() => {
    if (theme === 'auto' && imgRef.current) {
      const detected = detectParentBackgroundBrightness(imgRef.current);
      if (detected) {
        setContainerTheme(detected);
      }
    }
  }, [theme]);

  // Priority:
  // 1. Explicit theme prop ('light' | 'dark')
  // 2. Container surface brightness (light surface -> light-theme logo with dark text)
  // 3. Global or system theme mode
  const effectiveTheme: BrandThemeMode =
    theme !== 'auto'
      ? theme
      : containerTheme || globalTheme;

  // logo-light.png has dark navy text for light backgrounds
  // logo-dark.png has white text for dark backgrounds
  const logoSrc = effectiveTheme === 'dark' ? '/logo/logo-dark.png' : '/logo/logo-light.png';

  return (
    <img
      ref={imgRef}
      src={logoSrc}
      alt={alt}
      onClick={onClick}
      className={`object-contain select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        maxHeight: '100%',
        ...style,
      }}
      loading="eager"
      decoding="async"
      {...restProps}
    />
  );
};
