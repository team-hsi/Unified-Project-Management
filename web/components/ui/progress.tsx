"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  max?: number;
  // Circular variant props
  variant?: "default" | "circular";
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = "default",
      size = 60,
      strokeWidth = 6,
      showText = true,
      currentStep,
      totalSteps,
      ...props
    },
    ref
  ) => {
    // Calculate percentage for the progress
    const percentage = (value / max) * 100;

    // For circular variant
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Determine what text to show in the center for circular variant
    const displayText =
      currentStep && totalSteps
        ? `${currentStep}/${totalSteps}`
        : `${Math.round(percentage)}%`;

    if (variant === "circular") {
      return (
        <ProgressPrimitive.Root
          ref={ref}
          data-slot="progress"
          className={cn(
            "relative inline-flex items-center justify-center",
            className
          )}
          style={{ width: size, height: size }}
          {...props}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="rotate-[-90deg]"
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--primary)/0.2)"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <ProgressPrimitive.Indicator data-slot="progress-indicator" asChild>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </ProgressPrimitive.Indicator>
          </svg>
          {showText && (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
              {displayText}
            </div>
          )}
        </ProgressPrimitive.Root>
      );
    }

    // Default linear progress bar
    return (
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        className={cn(
          "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="bg-primary h-full w-full flex-1 transition-all"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
