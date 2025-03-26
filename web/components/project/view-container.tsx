import { Suspense } from "react";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { KanbanBoardSkeleton } from "@/components/kanban/skeletons";

//TODO: Implement dynamic imports for code splitting
/*
 * commented out dynamic imports for now
 */
// import dynamic from "next/dynamic";
// // Dynamically import views for code splitting
// const ListView = dynamic(() => import("@/components/list/list-view"), {
//   loading: () => <ListViewSkeleton />,
//   ssr: true,
// });

// const TimelineView = dynamic(
//   () => import("@/components/timeline/timeline-view"),
//   {
//     loading: () => <TimelineViewSkeleton />,
//     ssr: true,
//   }
// );

// // Import skeletons statically since they're small and used for loading states
// import { ListViewSkeleton } from "@/components/list/skeletons";
// import { TimelineViewSkeleton } from "@/components/timeline/skeletons";

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
}

export function ViewContainer({ view }: ViewContainerProps) {
  // Ensure we have a valid view key, defaulting to kanban
  const viewKey = (VIEWS[view as ViewKey] ? view : "kanban") as ViewKey;

  const { component: ViewComponent, skeleton: SkeletonComponent } =
    VIEWS[viewKey];

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <ViewComponent />
    </Suspense>
  );
}
