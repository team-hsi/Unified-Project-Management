import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TaskBreadcrumb } from "./task-breadcrumb";
import { TaskDetails } from "@/components/task/task-details";
import { TaskWorkflow } from "../task/task-workflow";
import { Task } from "../kanban/types";

export function TaskSheet({
  children,
  task,
}: {
  children: React.ReactNode;
  task: Task;
}) {
  const segments = ["design", "in-progress"];
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="rounded-xl max-w-md  md:max-w-lg lg:max-w-xl"
        hideClose
      >
        <TaskBreadcrumb segments={segments} />
        <TaskDetails task={task} /> {/* Pass the task prop to TaskDetails */}
        <TaskWorkflow subtasks={task.subtasks} />
      </SheetContent>
    </Sheet>
  );
}
