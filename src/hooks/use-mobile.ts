import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type ResponsiveBreakpoint = keyof typeof BREAKPOINTS;

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] =
    React.useState<ResponsiveBreakpoint | null>(null);

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= BREAKPOINTS['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= BREAKPOINTS.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= BREAKPOINTS.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= BREAKPOINTS.md) {
        setCurrentBreakpoint('md');
      } else if (width >= BREAKPOINTS.sm) {
        setCurrentBreakpoint('sm');
      } else {
        setCurrentBreakpoint(null);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return currentBreakpoint;
}

export function useIsBreakpointActive(
  breakpoint: ResponsiveBreakpoint,
): boolean {
  const currentBreakpoint = useBreakpoint();

  if (!currentBreakpoint) return false;

  const breakpointOrder: ResponsiveBreakpoint[] = [
    'sm',
    'md',
    'lg',
    'xl',
    '2xl',
  ];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  const targetIndex = breakpointOrder.indexOf(breakpoint);

  return currentIndex >= targetIndex;
}

export function useBreakpoints() {
  const [breakpoints, setBreakpoints] = React.useState({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false,
  });

  React.useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;

      setBreakpoints({
        sm: width >= BREAKPOINTS.sm,
        md: width >= BREAKPOINTS.md,
        lg: width >= BREAKPOINTS.lg,
        xl: width >= BREAKPOINTS.xl,
        '2xl': width >= BREAKPOINTS['2xl'],
      });
    };

    updateBreakpoints();

    let timeoutId: number;
    const throttledUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateBreakpoints, 100);
    };

    window.addEventListener('resize', throttledUpdate);
    return () => {
      window.removeEventListener('resize', throttledUpdate);
      clearTimeout(timeoutId);
    };
  }, []);

  return React.useMemo(
    () => breakpoints,
    [
      breakpoints.sm,
      breakpoints.md,
      breakpoints.lg,
      breakpoints.xl,
      breakpoints['2xl'],
    ],
  );
}
