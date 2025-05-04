import { Workspace } from "./space";

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
export interface Member {
  id: string;
  role: "admin" | "guest" | "member";
  user: User;
}

export interface MemberPayload {
  id: string;
  role: "admin" | "guest" | "member";
  userId: string;
}
