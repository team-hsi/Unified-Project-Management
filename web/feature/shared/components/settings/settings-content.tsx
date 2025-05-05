"use client";
import type React from "react";
import { SettingsView } from "./types";
import { PeopleView } from "./people";
import { SpaceView } from "./space-view";
import { PreferencesView } from "./preferences";
import { NotificationsView } from "./notifications";
import { GeneralView } from "./general";
// import { PeopleView } from "@/components/settings/views/people-view";
// import { BillingView } from "@/components/settings/views/billing-view";

interface SettingsContentProps {
  currentView: SettingsView;
}

export function SettingsContent({ currentView }: SettingsContentProps) {
  // Map views to components
  const viewComponents: Record<SettingsView, React.ReactNode> = {
    preferences: <PreferencesView />,
    notifications: <NotificationsView />,
    general: <GeneralView />,
    space: <SpaceView />,
    people: <PeopleView />, // Placeholder for PeopleView
  };

  return viewComponents[currentView] || <PreferencesView />;
}
