"use client";

import { ViewContainer } from "./view-container";

export function ViewContainerWrapper({ initialView }: { initialView: string }) {
  return <ViewContainer initialView={initialView} />;
}
