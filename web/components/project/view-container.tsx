import { Suspense } from "react";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { KanbanBoardSkeleton } from "@/components/kanban/skeletons";
import { DataTable } from "@/components/list/data-table";
import { ListViewSkeleton } from "@/components/list/skeletons";
import { getData } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";

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

export interface Item {
  id: string;
  name: string;
  description: string;
  bucketId: string;
  startDate?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
}

const ListView = async () => {
  const data = await getData();
  const columns: ColumnDef<Item>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "startDate", header: "Start Date" },
    { accessorKey: "dueDate", header: "Due Date" },
    { accessorKey: "priority", header: "Priority" },
    { accessorKey: "status", header: "Status" },
  ];
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} id="list-view" />{" "}
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
      <ViewComponent projectId={""} />
    </Suspense>
  );
}
