export type Workspace = {
  id: string;
  name: string;
  description: string | null;
  visibility: "private" | "public";
  members: string[];
  createdAt: string;
  updatedAt: string;
};

export type WorkspacePayload = {
  id: string;
  name: string;
  description?: string;
  visibility?: "private" | "public";
  members?: string[];
};
