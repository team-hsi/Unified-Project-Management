export type LabelPayload = {
  name: string;
  color: string;
  projectId: string;
  id: string;
};

export type Label = {
  id: string;
  name: string;
  color: string;
  project: {
    id: string;
    name: string;
    ownerId: string;
  };
  createdAt: string;
  updatedAt: string;
};
