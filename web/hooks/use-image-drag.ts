// useImageDrag.ts
import { useState } from "react";
import { useDrag } from "@use-gesture/react";

export const useImageDrag = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const bind = useDrag(({ offset: [x, y] }) => {
    setPosition({ x, y });
  });

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  return { position, bind, resetPosition };
};
