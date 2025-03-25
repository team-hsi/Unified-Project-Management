"use client";
import { fetchTaskByID } from "@/actions/task-actions";
import { TaskDetails } from "@/components/task/task-details";
import { TaskWorkflow } from "@/components/task/task-workflow";
import { useSuspenseQuery } from "@tanstack/react-query";

const Page = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["task", "task1"],
    queryFn: ({ queryKey }) => fetchTaskByID(queryKey[1]),
  });

  return (
    <div>
      <TaskDetails task={data} />
      <TaskWorkflow />
    </div>
  );
};

export default Page;
