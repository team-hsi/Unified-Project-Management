import { create } from "zustand";

type ViewType = "kanban" | "list" | "documents";

interface ViewState {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  activeView: "kanban",
  setActiveView: (view) => set({ activeView: view }),
}));
