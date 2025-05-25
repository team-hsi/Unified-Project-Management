import { Suspense } from "react";
import dynamic from "next/dynamic";
import { KanbanBoardSkeleton } from "./kanban/shared/skeletons";
import { ListViewSkeleton } from "./list/shared/skeletons";
import { useViewStore } from "@/lib/stores/view-store";
import { DocumentsSkeleton } from "@/feature/documentation/components/DocumentsSkeleton";

// Dynamically import components with their loading states
const KanbanBoard = dynamic(
  () =>
    import("./kanban/components/kanban-board").then((mod) => mod.KanbanBoard),
  {
    loading: () => <KanbanBoardSkeleton />,
    ssr: true,
  }
);

const ListView = dynamic(
  () => import("./list/components/list").then((mod) => mod.ListView),
  {
    loading: () => <ListViewSkeleton />,
    ssr: true,
  }
);

const DocumentsView = dynamic(
  () => import("./documents/documents").then((mod) => mod.DocumentsView),
  {
    loading: () => <DocumentsSkeleton />,
    ssr: true,
  }
);

const VIEWS = {
  kanban: {
    component: KanbanBoard,
    skeleton: KanbanBoardSkeleton,
  },
  list: {
    component: ListView,
    skeleton: ListViewSkeleton,
  },
  documents: {
    component: DocumentsView,
    skeleton: () => <div>Document skeleton Component</div>,
  },
};

type ViewKey = keyof typeof VIEWS;

export function ViewContainer({ initialView }: { initialView: string }) {
  const activeView = useViewStore((state) => state.activeView);
  const viewKey = (VIEWS[activeView] ? activeView : initialView) as ViewKey;

  const { component: ViewComponent, skeleton: SkeletonComponent } =
    VIEWS[viewKey];

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <ViewComponent />
    </Suspense>
  );
}
