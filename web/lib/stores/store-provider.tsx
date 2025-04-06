"use client";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type ProjectStore, createProjectStore } from "./project-store";

export type ProjectStoreApi = ReturnType<typeof createProjectStore>;

export const ProjectStoreContext = createContext<ProjectStoreApi | undefined>(
  undefined
);

export const ProjectStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<ProjectStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createProjectStore();
  }
  return (
    <ProjectStoreContext.Provider value={storeRef.current}>
      {children}
    </ProjectStoreContext.Provider>
  );
};

export const useProjectStore = <T,>(
  selector: (store: ProjectStore) => T
): T => {
  const store = useContext(ProjectStoreContext);
  if (!store) {
    throw new Error(
      "useProjectStore must be used within a ProjectStoreProvider"
    );
  }
  return useStore(store, selector);
};
