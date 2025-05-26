import { Room } from "./room";
import { Workspace, WorkspaceWithUser } from "./space";

export type Role = "owner" | "admin" | "member" | "guest";

export interface UserPayload {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  activeSpaceId: string | null;
}
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  activeSpace: Workspace | null;
  createdAt: string;
  updatedAt: string;
}
export interface UserWithToken {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserWithRooms extends User {
  rooms: Room[];
}
export interface Member {
  id: string;
  role: Omit<Role, "owner">;
  user: User;
}

export interface MemberWithSpace extends Member {
  space: WorkspaceWithUser;
}

export interface MemberPayload {
  id: string;
  role: Member["role"];
  userId: string;
}

export interface Session {
  isAuth: boolean;
  activeSpace: unknown;
  userId: unknown;
  tokens: {
    accessToken: unknown;
    refreshToken: unknown;
  };
  expiresAt?: unknown;
}
