"use client";
import type React from "react";
import { SettingsView } from "./types";
import { PeopleView } from "./people";
import { PreferencesView } from "./preferences";
import { GeneralView } from "./general";
import { AccountView } from "./account";
import { PermissionsView } from "./permissions";
import { Workspace } from "../../@types/space";
import { MyInvitations } from "./my-invitations";
import { SentInvitations } from "./sent-invitations";

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
    people: <PeopleView workspace={workspace} />,
    account: <AccountView />,
    permissions: <PermissionsView workspace={workspace} />,
    "my-invitations": <MyInvitations />,
    "sent-invitations": <SentInvitations />,
  };

  return viewComponents[currentView] || <PreferencesView />;
}
