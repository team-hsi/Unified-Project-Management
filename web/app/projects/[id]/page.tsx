import { fetchTasks } from "@/actions/task-actions";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { KanbanBoardSkeleton } from "@/components/kanban/skeletons";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { Suspense } from "react";

const Page = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({ queryKey: ["board"], queryFn: fetchTasks });

  return (
    <Suspense fallback={<KanbanBoardSkeleton />}>
      <KanbanBoard />
    </Suspense>
  );
};

export default Page;
