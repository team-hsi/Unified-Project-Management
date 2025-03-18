import BoardCover from "@/components/project/project-boardcover";
import TaskList from "@/components/project/list-content";

const Page = () => {
  return (
    <div className="bg-muted/50 flex-1 rounded-xl">
      <BoardCover />
      <TaskList />
    </div>
  );
};

export default Page;
