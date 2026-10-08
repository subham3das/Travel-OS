import { useState, useEffect } from 'react';

export type BrandThemeMode = 'light' | 'dark';

/**
 * Hook to automatically determine the active brand theme ('light' or 'dark').
 * Reactively responds to:
 * 1. DOM class mutations on document.documentElement (e.g., class="dark")
 * 2. System theme preference changes (prefers-color-scheme: dark)
 * Never requires a page refresh.
 */
export function useBrandTheme(explicitTheme?: 'light' | 'dark' | 'auto'): BrandThemeMode {
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [domIsDark, setDomIsDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Listen for system theme preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleSystemChange);
    }

    // 2. Observe DOM mutations on document.documentElement class attribute
    const observer = new MutationObserver(() => {
      setDomIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(handleSystemChange);
      }
      observer.disconnect();
    };
  }, []);

  if (explicitTheme && explicitTheme !== 'auto') {
    return explicitTheme;
  }

  // If DOM specifically has dark class, use dark. Otherwise fallback to system preference.
  if (domIsDark) {
    return 'dark';
  }

  return systemIsDark ? 'dark' : 'light';
}
