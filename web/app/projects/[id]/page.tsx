import { fetchTasks } from "@/actions/task-actions";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { getQueryClient } from "@/lib/query-client/get-query-client";

const Page = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({ queryKey: ["board"], queryFn: fetchTasks });

  return <KanbanBoard />;
};

export default Page;