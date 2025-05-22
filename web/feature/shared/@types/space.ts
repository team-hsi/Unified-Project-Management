import { Member, User } from "./user";

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  description: string | null;
  visibility: "private" | "public";
  permissions: Permission;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspacePayload {
  id: string;
  name: string;
  description?: string;
  visibility: "private" | "public";
  permissions: Permission;
}

export interface WorkspaceWithMembers extends Workspace {
  members: Member[];
}

export interface WorkspaceWithUser extends Omit<Workspace, "ownerId"> {
  owner: Omit<User, "activeSpace">;
}

export type Permission = Record<string, string[]>;
