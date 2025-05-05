import { Item } from "@/feature/shared/@types/item";
import { Project } from "@/feature/shared/@types/projects";

export type BucketPayload = {
  id: string;
  name: string;
  color?: string;
  projectId: string;
};

export interface Bucket {
  id: string;
  name: string;
  project: Project
  items: Item[];
  color: string;
  createdAt: string;
  updatedAt: string;
}
