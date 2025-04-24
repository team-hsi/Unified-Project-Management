export type Workspace = {
  id: string;
  name: string;
  description: string | null;
  visibility: "private" | "public";
  members: string[];
  createdAt: string;
  updatedAt: string;
};
