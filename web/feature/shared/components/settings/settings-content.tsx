"use client";
import type React from "react";
import { SettingsView } from "./types";
import { PeopleView } from "./people";
import { PreferencesView } from "./preferences";
import { GeneralView } from "./general";
import { AccountView } from "./account";
import { PermissionsView } from "./permissions";
import { Workspace } from "../../@types/space";
import { Invitations } from "./invitations";

interface SettingsContentProps {
  currentView: SettingsView;
  workspace: Workspace;
}

export function SettingsContent({
  currentView,
  workspace,
}: SettingsContentProps) {
  // Map views to components
  const viewComponents: Record<SettingsView, React.ReactNode> = {
    preferences: <PreferencesView />,
    general: <GeneralView workspace={workspace} />,
    people: <PeopleView />,
    account: <AccountView />,
    permissions: <PermissionsView workspace={workspace} />,
    invitations: <Invitations />,
  };

  return viewComponents[currentView] || <PreferencesView />;
}
