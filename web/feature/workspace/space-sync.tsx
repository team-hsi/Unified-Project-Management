"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useWorkspace } from "../shared/hooks/use-workspace";
import { useUser } from "@/lib/auth/auth-provider";

export function SpaceSync() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { setActive } = useWorkspace();
  const { session } = useUser();

  useEffect(() => {
    if (!session || !setActive || session.activeSpace === workspaceId) return;

    const syncSpace = async () => {
      try {
        await setActive.mutateAsync(workspaceId);
      } catch (error) {
        console.error("Failed to sync workspace:", error);
      }
    };
    syncSpace();
  }, [workspaceId, session, setActive]);

  return null;
}
