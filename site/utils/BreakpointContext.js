import React, { createContext, useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash-es';

const breakpoints = [{
  id: 'xs',
  value: 320,
  device: 'mobile'
}, {
  id: 'sm',
  value: 480,
  device: 'mobile',
  deviceSize: 'lg'
}, {
  id: 'md',
  value: 760,
  device: 'tablet'
}, {
  id: 'lg',
  value: 960,
  device: 'desktop',
  deviceSize: 'sm'
}, {
  id: 'xl',
  value: 1200,
  device: 'desktop'
}, {
  id: 'xxl',
  value: 1600,
  device: 'desktop',
  deviceSize: 'lg'
}];

// Initializes our "context object" to hold data
export const BreakpointContext = createContext();
BreakpointContext.displayName = 'BreakpointContext';

// Grabs our data and "provides" it to any wrapped child components (see _app.js)
export const BreakpointProvider = ({ children }) => {
  const [breakpoint, setBreakpoint] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [deviceSize, setDeviceSize] = useState(null);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      const screenW = document.body.offsetWidth;

      breakpoints.every(def => {
        if(screenW < def.value || def.id === 'xxl') {
          setBreakpoint(def.id);
          setIsMobile(def.device === 'mobile');
          setIsTablet(def.device === 'tablet');
          setIsDesktop(def.device === 'desktop');
          setDeviceSize(def.deviceSize || null);

          return false;
        }

        return true;
      });

      setScreenWidth(screenW);
    }

    handleResize();

    // To help performance, execute this at most once every 200ms
    const handleResizeDebounced = debounce(handleResize, 200);

    window.addEventListener('resize', handleResizeDebounced, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResizeDebounced);
    };
  }, []);

  const data = useMemo(() => {
    return {
      breakpoint,
      isMobile,
      isTablet,
      isDesktop,
      deviceSize,
      screenWidth,
      breakpoints
    };
  }, [breakpoint, isMobile, isTablet, isDesktop, deviceSize, screenWidth]);

  return (
    <BreakpointContext.Provider value={data}>{children}</BreakpointContext.Provider>
  );
};
