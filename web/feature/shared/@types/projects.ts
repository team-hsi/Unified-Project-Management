import { Permission } from "./space";
import { Member } from "./user";

export type ProjectPayload = {
  id: string;
  name: string;
  spaceId: string;
};

export type Project = {
  id: string;
  name: string;
  ownerId: string;
  space: string;
  permissions: Permission;
  createdAt: string;
  updatedAt: string;
};

export interface ProjectWithMembers extends Project {
  members: Member[];
}

export interface ProjectMatrix {
  project: Project;
  counts: MatrixData;
}

export type MatrixData = {
  total: number;
  done: number;
  overdue: number;
  todo: number;
  inprogress: number;
  priority: number;
  unassigned: number;
};
