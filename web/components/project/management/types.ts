import { Label } from "@/components/ui/label";
export type ManagementsView = "general" | "notifications" | "people" | "labels";

// | "connections"
// | "sites"
// | "emoji"
// | "import"
// | "billing"
// | "plans";

export type ProjectLabel = {
  name: string;
  color: string;
  projectId?: string;
  id?: string;
};

export type Label = {
  name: string;
  color: string;
  project: {
    id: string;
    name: string;
    ownerId: string;
  };
  id?: string;
};
