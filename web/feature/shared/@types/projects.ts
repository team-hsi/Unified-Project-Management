import { Permission } from "./space";

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
