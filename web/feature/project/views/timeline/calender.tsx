"use client";

import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-shadcn/dist/index.css";
import { useState, useMemo } from "react";
import { useKanban } from "@/feature/shared/hooks/use-kanban";

function CalendarApp() {
  const { items } = useKanban();
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const calendarEvents = useMemo(() => {
    return items
      .filter(
        (item): item is typeof item & { startDate: string; dueDate: string } =>
          Boolean(item.startDate && item.dueDate)
      )
      .map((item) => ({
        id: item.id,
        title: item.name,
        start: item.startDate.split("T")[0],
        end: item.dueDate.split("T")[0],
        color: item.bucket?.color || "#22c55ed6",
        description: item.description || "",
        status: item.status,
        priority: item.priority,
      }));
  }, [items]);

  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    theme: "shadcn",
    events: calendarEvents,
    plugins: [eventsService],
    callbacks: {
      onRender: () => {
        eventsService.getAll();
      },
    },
  });

  return (
    <div
      // className="p-4 pt-0 rounded-lg border bg-card"
      className="calendar-container rounded-2xl shadow-2xl bg-white border text-xs font-thin border-gray-200 overflow-hidden"
      style={{ height: "700px" }}
    >
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarApp;
