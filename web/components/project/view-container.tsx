import { Suspense } from "react";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { KanbanBoardSkeleton } from "@/components/kanban/skeletons";
import { DataTable } from "@/components/list/data-table";
import { Task, columns } from "@/components/list/columns";
import { ListViewSkeleton } from "@/components/list/skeletons";
import { getData } from "@/lib/data";

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

const ListView = async () => {
  const data = await getData();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

const VIEWS = {
  kanban: {
    component: KanbanBoard,
    skeleton: KanbanBoardSkeleton,
  },
  list: {
    component: ListView,
    skeleton: ListViewSkeleton,
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
