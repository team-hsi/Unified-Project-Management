import { createStore } from "zustand/vanilla";

export type Project = {
  id: string;
  name: string;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectStates = {
  // projects: Project[];
  activeProject: Project | null;
};

export type ProjectActions = {
  // setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
};

export type ProjectStore = ProjectStates & ProjectActions;

export const defaultInitState: ProjectStates = {
  // projects: [],
  activeProject: null,
};

export const createProjectStore = (
  initialData: ProjectStates = defaultInitState
) => {
  return createStore<ProjectStore>((set) => ({
    ...initialData,
    // setProjects: (projects: Project[]) =>
    //   set((state) => ({ ...state, projects })),
    setActiveProject: (project: Project | null) =>
      set((state) => ({
        ...state,
        activeProject: project,
      })),
  }));
};
