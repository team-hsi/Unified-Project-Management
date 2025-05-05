"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useWorkspace } from "../../hooks/use-workspace";
import { useUser } from "@/lib/auth/auth-provider";

export function SpaceSync() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { setActive } = useWorkspace();
  const { session } = useUser();

  useEffect(() => {
    if (!session) return;
    if (!setActive) return;
    if (session.activeSpace === workspaceId) return;
    setActive.mutateAsync(workspaceId);
  }, [workspaceId]);

  return null;
}
