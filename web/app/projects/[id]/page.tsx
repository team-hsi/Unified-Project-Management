import { fetchTasks } from "@/actions/task-actions";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import ProjectHeader from "@/components/project-header/ProjectInfo";
import BoardCover from "@/components/project/project-boardcover";
import { getQueryClient } from "@/lib/query-client/get-query-client";
const projectInfo = {
  projectName: "Project Name",
  users: [
    {
      id: 1,
      name: "Abraham Kasa",
      avatarUrl: "/user-1.png",
    },
    {
      id: 2,
      name: "Helen Tesfaye",
      avatarUrl: "/user-2.png",
    },
    {
      id: 3,
      name: "Gemeda Tesfaye",
      avatarUrl: "/user-3.png",
    },
  ],
};

const Page = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({ queryKey: ["board"], queryFn: fetchTasks });

  return (
    <div>
      {/* <BoardCover /> */}
      {/* <ProjectHeader {...projectInfo} /> */}
      <KanbanBoard />
    </div>
  );
};

export default Page;
