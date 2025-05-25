'use client';

import { useRef } from 'react';

export function useIsFirstRender(): boolean {
  const isFirstRender = useRef(true);

  // Don't change the value until after the effect has had a chance to run
  if (isFirstRender.current) {
    // Use setTimeout to change it after the current render cycle
    setTimeout(() => {
      isFirstRender.current = false;
    }, 0);
    return true;
  }

  return false;
}
