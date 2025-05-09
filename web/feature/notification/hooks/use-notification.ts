/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useUser } from "@/lib/auth/auth-provider";
import { socketManager } from "@/lib/notification/socket-manager";
import { useNotificationStore } from "../store/notification-store";
import { Notification } from "../@types/notification";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  content: string;
  roomId: string;
  senderId: string;
  createdAt: string;
}

interface ProjectUpdate {
  id: string;
  projectId: string;
  message: string;
}

interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  workspaceName: string;
}

export const useNotification = () => {
  const { session } = useUser();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!session?.tokens.accessToken) return;

    socketManager.connect(session.tokens.accessToken as string);

    const handleNewMessage = (message: ChatMessage) => {
      const notification: Notification = {
        id: message.id,
        type: "chat",
        title: "New Message",
        message: message.content,
        data: {
          chatId: message.roomId,
          senderId: message.senderId,
        },
        read: false,
        createdAt: new Date(message.createdAt),
      };

      addNotification(notification);
      toast.info("New message received", {
        description: message.content,
      });
    };

    const handleProjectUpdate = (update: ProjectUpdate) => {
      const notification: Notification = {
        id: update.id,
        type: "project",
        title: "Project Update",
        message: update.message,
        data: {
          projectId: update.projectId,
        },
        read: false,
        createdAt: new Date(),
      };

      addNotification(notification);
      toast.info("Project update", {
        description: update.message,
      });
    };

    const handleWorkspaceInvite = (invite: WorkspaceInvite) => {
      const notification: Notification = {
        id: invite.id,
        type: "workspace",
        title: "Workspace Invitation",
        message: `You've been invited to join ${invite.workspaceName}`,
        data: {
          workspaceId: invite.workspaceId,
        },
        read: false,
        createdAt: new Date(),
      };

      addNotification(notification);
      toast.info("Workspace invitation", {
        description: `You've been invited to join ${invite.workspaceName}`,
      });
    };

    // Subscribe to events
    socketManager.subscribe<ChatMessage>("new-message", handleNewMessage);
    socketManager.subscribe<ProjectUpdate>(
      "project-update",
      handleProjectUpdate
    );
    socketManager.subscribe<WorkspaceInvite>(
      "workspace-invite",
      handleWorkspaceInvite
    );

    return () => {
      socketManager.disconnect();
    };
  }, [session?.tokens.accessToken, addNotification]);
};
