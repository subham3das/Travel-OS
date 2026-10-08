import React from 'react';

export interface BrandIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  alt?: string;
  isDecorative?: boolean;
  onClick?: () => void;
}

/**
 * ApnaTrip Centralized App Icon Component
 * Uses /logo/icon.png for collapsed states, mobile navigation, splash screen, and loading icons.
 * Never stretches, preserves aspect ratio, and includes accessible markup.
 */
export const BrandIcon: React.FC<BrandIconProps> = ({
  className = 'w-8 h-8',
  alt = 'ApnaTrip',
  isDecorative = false,
  onClick,
  style,
  ...restProps
}) => {
  return (
    <img
      src="/logo/icon.png"
      alt={isDecorative ? '' : alt}
      aria-hidden={isDecorative ? 'true' : undefined}
      onClick={onClick}
      className={`object-contain select-none shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        ...style,
      }}
      loading="eager"
      decoding="async"
      {...restProps}
    />
  );
};
