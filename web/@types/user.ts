import { Workspace } from "./space";

export type UserPayload = {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  activeSpaceId: string | null;
};

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
