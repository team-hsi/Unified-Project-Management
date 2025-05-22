export type Document = {
  id: string;
  name: string;
  content: string;
  projetId: string;
  createdAt: string;
  updatedAt: string;
};

export type DocumentPayload = {
  id: string;
  name: string;
  projectId: string;
  content: string;
};
