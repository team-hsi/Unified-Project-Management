"use client";
import type React from "react";
import { SettingsView } from "./types";
import { PeopleView } from "./people";
import { PreferencesView } from "./preferences";
import { NotificationsView } from "./notifications";
import { GeneralView } from "./general";

interface SettingsContentProps {
  currentView: SettingsView;
}

export function SettingsContent({ currentView }: SettingsContentProps) {
  // Map views to components
  const viewComponents: Record<SettingsView, React.ReactNode> = {
    preferences: <PreferencesView />,
    notifications: <NotificationsView />,
    general: <GeneralView />,
    people: <PeopleView />, // Placeholder for PeopleView
  };

  return viewComponents[currentView] || <PreferencesView />;
}
