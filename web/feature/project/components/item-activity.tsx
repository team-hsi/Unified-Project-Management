import { Activity } from "@/feature/shared/@types/item";
import { formatDistanceToNow } from "date-fns";
import { ReactElement } from "react";

export const ItemActivity = ({
  activities,
  name,
}: {
  activities?: Activity[];
  name: string;
}) => {
  function getActionText(
    action: Activity["activityType"],
    name: string
  ): ReactElement {
    const texts: Record<Activity["activityType"], ReactElement> = {
      created: (
        <span>
          created a new task <span className="font-bold">{name}</span>
        </span>
      ),
      updated: (
        <span>
          updated task <span className="font-bold">{name}</span>
        </span>
      ),
      deleted: (
        <span>
          deleted task <span className="font-bold">{name}</span>
        </span>
      ),
      commented: (
        <span>
          commented on task <span className="font-bold">{name}</span>
        </span>
      ),
      reply: <span>replied to a comment</span>,
    };

    return texts[action];
  }
  function getInitials(firstname: string, lastname: string) {
    return `${firstname[0]}${lastname[0]}`.toUpperCase();
  }
  return (
    <div className="relative h-full overflow-y-auto pr-4">
      <div className="space-y-6">
        {activities?.map((activity) => {
          return (
            <div key={activity.id} className="relative flex gap-4">
              {/* User initials circle with connecting line */}
              <div className="flex-shrink-0 relative flex gap-4 items-center">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary ring-2 ring-background">
                  {getInitials(
                    activity.actor.firstname,
                    activity.actor.lastname
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {activity.actor.firstname} {activity.actor.lastname}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {getActionText(activity.activityType, name)}
                  </span>
                </div>
                {activity.metadata &&
                  Object.entries(activity.metadata).map(([key, value]) => (
                    <p key={key} className="text-sm text-muted-foreground">
                      {key}:{" "}
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : value}
                    </p>
                  ))}
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
