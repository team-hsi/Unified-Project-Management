export type LabelPayload = {
  name: string;
  color: string;
  projectId: string;
  id: string;
};

export type Label = {
  name: string;
  color: string;
  project: {
    id: string;
    name: string;
    ownerId: string;
  };
  id: string;
};
