"use client";

import React, { useState, useEffect } from "react";

interface MessageTimeProps {
  timestamp: string;
  className?: string;
}

export function MessageTime({ timestamp, className }: MessageTimeProps) {
  const [formattedTime, setFormattedTime] = useState(timestamp);

  useEffect(() => {
    const formatMessageTime = (timeString: string) => {
      // If it's a time (10:30 AM format)
      if (
        timeString.includes(":") &&
        (timeString.includes("AM") || timeString.includes("PM"))
      ) {
        return timeString;
      }

      // For "Yesterday", "Tuesday", etc.
      if (
        [
          "Yesterday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].includes(timeString)
      ) {
        return timeString;
      }

      // Try to parse as date if it's not one of the above
      try {
        const date = new Date(timeString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else if (diffDays === 1) {
          return "Yesterday";
        } else if (diffDays < 7) {
          return date.toLocaleDateString([], { weekday: "long" });
        } else {
          return date.toLocaleDateString([], {
            month: "short",
            day: "numeric",
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return timeString;
      }
    };

    setFormattedTime(formatMessageTime(timestamp));
  }, [timestamp]);

  return <span className={className}>{formattedTime}</span>;
}
