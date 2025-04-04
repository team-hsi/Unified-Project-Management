import { Button } from "@/components/ui/button";
import ProjectTabs from "./project-tabs";
import { Filter } from "lucide-react";

export const ProjectHeader = ({ id }: { id: string }) => {
  return (
    <div className="flex flex-col rounded-lg">
      <div className="flex items-center justify-between w-full p-4 pb-3  mx-auto">
        <div className="flex items-center gap-3">
          <div className="border-2 w-10 h-10 rounded-lg flex items-center justify-center text-xl font-semibold">
            {id[0]}
          </div>
          <h1 className="text-2xl font-semibold">{id}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-sm font-medium">
            Invite
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row max-w-7xl justify-between items-start sm:items-center p-4 pt-3 gap-4">
        <ProjectTabs />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* //Todo: expandable search input */}
          <Button size="sm">
            <Filter /> Filter
          </Button>
          <Button size="sm">New Task</Button>
        </div>
      </div>
    </div>
  );
};
