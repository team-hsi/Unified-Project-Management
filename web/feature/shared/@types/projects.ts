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
  createdAt: string;
  updatedAt: string;
};
