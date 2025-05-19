"use server";

import { BucketPayload } from "@/feature/shared/@types/bucket";
import { get } from "../../../core/api-client";
import { Item, ItemPayload } from "@/feature/shared/@types/item";
import { extractErrors } from "@/lib/utils";
import { ProjectPayload } from "@/feature/shared/@types/projects";
import { CACHE_LIFE, CACHE_TAGS } from "../../../core/cache-config";

export const getAllItem = async () => {
  try {
    return await get<Item>(`/items/getall`);
  } catch (error) {
    console.error(`Error fetching all items`, error);
    throw new Error(extractErrors(error));
  }
};

export const getItemById = async (payload: Pick<ItemPayload, "id">) => {
  try {
    return await get<Item>(`/items/${payload.id}`, {
      next: {
        revalidate: CACHE_LIFE.SHORT,
        tags: [CACHE_TAGS.ITEM.ONE(payload.id)],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error(`Error fetching item ${payload.id}:`, error);
    throw new Error(extractErrors(error));
  }
};

export const getProjectItems = async (payload: Pick<ProjectPayload, "id">) => {
  try {
    return await get<Item[]>(`/projects/${payload.id}/items`, {
      next: {
        revalidate: CACHE_LIFE.SHORT,
        tags: [CACHE_TAGS.PROJECT.ITEMS(payload.id)],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error(`Error fetching project ${payload.id} items:`, error);
    throw new Error(extractErrors(error));
  }
};

export const getBucketItems = async (payload: Pick<BucketPayload, "id">) => {
  try {
    return await get<Item[]>(`/buckets/${payload.id}/items`, {
      next: {
        revalidate: CACHE_LIFE.SHORT,
        tags: [CACHE_TAGS.BUCKET.ITEMS(payload.id)],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error(`Error fetching bucket ${payload.id} items:`, error);
    throw new Error(extractErrors(error));
  }
};
