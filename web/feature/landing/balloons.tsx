"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsFirstRender } from "../shared/hooks/useIsFirstRender";

export interface BalloonsProps {
  type?: "default" | "text";
  texts?: { text: string; fontSize: number; color: string }[];
  fontSize?: number;
  color?: string;
  className?: string;
  onLaunch?: () => void;
  autoLaunch?: boolean;
}

export interface BalloonsRef extends HTMLDivElement {
  launchAnimation: () => void;
}

const Balloons = React.forwardRef<BalloonsRef, BalloonsProps>(
  (
    {
      type = "default",
      texts,
      fontSize = 120,
      color = "#000000",
      className,
      onLaunch,
      autoLaunch = true,
    },
    ref
  ) => {
    const balloonsRef = React.useRef<HTMLDivElement>(null);
    const isFirstRender = useIsFirstRender();

    const launchAnimation = React.useCallback(async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { balloons, textBalloons } = await import("balloons-js");

        if (type === "default") {
          balloons();
        } else if (type === "text" && texts) {
          texts.forEach(
            (text: { text: string; fontSize: number; color: string }) => {
              setTimeout(() => {
                textBalloons([text]);
              });
            }
          );
        }

        if (onLaunch) {
          onLaunch();
        }
      } catch (error) {
        console.error("Failed to load balloons-js:", error);
      }
    }, [type, texts, fontSize, color, onLaunch]);

    React.useEffect(() => {
      if (isFirstRender && autoLaunch) {
        const timer = setTimeout(() => {
          launchAnimation();
        }, 100);

        return () => clearTimeout(timer);
      }
    }, [isFirstRender, autoLaunch, launchAnimation]);

    React.useImperativeHandle(
      ref,
      () => ({
        ...balloonsRef.current!,
        launchAnimation,
      }),
      [launchAnimation]
    );
    return (
      <div
        ref={balloonsRef}
        className={cn("pointer-events-none fixed inset-0 z-[9999]", className)}
      />
    );
  }
);

Balloons.displayName = "Balloons";

export { Balloons };
