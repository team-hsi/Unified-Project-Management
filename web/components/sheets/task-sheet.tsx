import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TaskBreadcrumb } from "./task-breadcrumb";
import { TaskDetails } from "@/components/task/task-details";
// import { TaskWorkflow } from "../task/task-workflow";
import { Task } from "../task/types";
import { TaskWorkflow } from "../task/task-workflow";

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
        className="rounded-xl max-w-lg  md:max-w-xl lg:max-w-2xl"
        hideClose
      >
        <TaskBreadcrumb segments={segments} />
        <TaskDetails task={task} />
        <TaskWorkflow />
      </SheetContent>
    </Sheet>
  );
}
