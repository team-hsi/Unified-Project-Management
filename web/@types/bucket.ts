import { Item } from "@/@types/item";

export type BucketPayload = {
  id: string;
  name: string;
  color?: string;
  projectId: string;
};

export interface Bucket {
  id: string;
  name: string;
  project: {
    name: string;
    ownerId: string;
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  items: Item[];
  color: string;
  createdAt: string;
  updatedAt: string;
}
