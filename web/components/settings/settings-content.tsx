"use client";
import type React from "react";

import { PreferencesView } from "@/components/settings/preferences";
import { NotificationsView } from "@/components/settings/notifications";
import { GeneralView } from "@/components/settings/general";
import { SettingsView } from "./types";
import { PeopleView } from "./people";
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
    people: <PeopleView />, // Placeholder for PeopleView
  };

  return viewComponents[currentView] || <PreferencesView />;
}
