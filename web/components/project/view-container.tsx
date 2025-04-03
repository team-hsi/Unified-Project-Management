import { Suspense } from "react";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { KanbanBoardSkeleton } from "@/components/kanban/skeletons";

const VIEWS = {
  kanban: {
    component: KanbanBoard,
    skeleton: KanbanBoardSkeleton,
  },
  list: {
    component: () => <div>List View Component</div>,
    skeleton: () => <div>ListViewSkeleton Component</div>,
  },
  timeline: {
    component: () => <div>Timeline View Component</div>,
    skeleton: () => <div>TimelineViewSkeleton Component</div>,
  },
};

type ViewKey = keyof typeof VIEWS;

interface ViewContainerProps {
  view: string;
  projectId: string;
}

export function ViewContainer({ view, projectId }: ViewContainerProps) {
  // Ensure we have a valid view key, defaulting to kanban
  const viewKey = (VIEWS[view as ViewKey] ? view : "kanban") as ViewKey;

  const { component: ViewComponent, skeleton: SkeletonComponent } =
    VIEWS[viewKey];

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <ViewComponent projectId={projectId} />
    </Suspense>
  );
}
