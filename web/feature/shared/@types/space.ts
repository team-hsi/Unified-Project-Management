import { Member } from "./user";

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  description: string | null;
  visibility: "private" | "public";
  createdAt: string;
  updatedAt: string;
}

export interface WorkspacePayload {
  id: string;
  name: string;
  description?: string;
  visibility: "private" | "public";
}

export interface WorkspaceWithMembers extends Workspace {
  members: Member[];
}
