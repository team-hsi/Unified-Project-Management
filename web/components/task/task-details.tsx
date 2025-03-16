import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SheetTitle } from "../ui/sheet";
import {
  CalendarRange,
  ChevronsUp,
  CircleSmall,
  Loader,
  Newspaper,
  Plus,
  Users,
} from "lucide-react";
import { TaskPriorityBadge } from "./task-priority-badge";
import { Textarea } from "../ui/textarea";
import { Task } from "../kanban/types";

export const TaskDetails = ({ task }: { task: Task }) => {
  return (
    <div>
      <div className="px-4 flex flex-col gap-3 lg:px-6 pb-4">
        <SheetTitle className="font-bold text-xl md:text-2xl xl:text-3xl">
          {task.title}
        </SheetTitle>
        <div className="space-y-4">
          {/* TaskMetadata */}
          <section className=" flex flex-col flex-wrap gap-4">
            <div className="flex  items-center  gap-2 flex-auto">
              <div className="flex items-center gap-2 ">
                <Loader size={15} className=" text-muted-foreground" />
                <p className="w-24 text-sm text-muted-foreground">Status</p>
              </div>
              <div className="flex items-center ">
                <CircleSmall size={20} className="text-blue-400" />
                <span className="text-sm font-medium">{task.status}</span>{" "}
                {/* Updated to reflect task status */}
              </div>
            </div>

            <div className="flex  items-center  gap-2 flex-auto">
              <div className="flex items-center gap-2 ">
                <CalendarRange size={15} className=" text-muted-foreground" />
                <p className="w-24 text-sm text-muted-foreground">Due date</p>
              </div>
              <span className="text-sm font-medium">5 March 2024</span>
            </div>

            <div className="flex  items-center  gap-2 flex-auto">
              <div className="flex items-center gap-2">
                <Users size={15} className=" text-muted-foreground" />
                <p className="w-24 text-sm text-muted-foreground">Assignee</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-2">
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Calum Tyler"
                    />
                    <AvatarFallback className="text-xs">CT</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Dawson Tarman"
                    />
                    <AvatarFallback className="text-xs bg-green-100 text-green-800">
                      DT
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs ">
                      <Plus size={10} />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <div className="flex  items-center  gap-2">
              <div className="flex items-center gap-2">
                <ChevronsUp size={15} className=" text-muted-foreground" />
                <p className="w-24 text-sm text-muted-foreground">Priority</p>
              </div>
              <div className="flex items-center">
                <TaskPriorityBadge priority={task.priority} />
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 flex-auto">
              <div className="flex items-center gap-2">
                <Newspaper size={15} className=" text-muted-foreground" />
                <p className="w-24 text-sm text-muted-foreground">
                  Description
                </p>
              </div>
              <Textarea
                readOnly
                value={task.description}
                className="w-full p-2 border rounded-md text-sm"
                placeholder="Enter description"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
