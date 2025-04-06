"use client";

import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { useProjectStore } from "@/lib/stores/store-provider";
import { Project } from "@/lib/stores/project-store";
import { getQueryClient } from "@/lib/query-client/get-query-client";

export function ProjectUrlSync() {
  const { id } = useParams<{ id: string }>();
  const queryClient = getQueryClient();
  const setActiveProject = useProjectStore((store) => store.setActiveProject);

  useEffect(() => {
    if (!id) {
      setActiveProject(null);
      return;
    }

    const projects = queryClient.getQueryData<Project[]>(["projects"]);

    if (projects && projects.length > 0) {
      const activeProject = projects.find((project) => project.id === id);

      if (!activeProject) {
        notFound();
      } else {
        setActiveProject(activeProject);
      }
    }
  }, [id, queryClient, setActiveProject]);

  return null;
}
