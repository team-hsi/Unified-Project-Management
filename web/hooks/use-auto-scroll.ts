import * as React from "react";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

// Hook to enable auto-scrolling for drag and drop operations

export const useAutoScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return autoScrollForElements({
      element,
    });
  }, [ref]);
};
