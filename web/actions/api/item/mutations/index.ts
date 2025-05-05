"use server";
import { post, put, del } from "../../../core/api-client";
import {
  Item,
  ItemDnDPayload,
  ItemPayload,
} from "@/feature/shared/@types/item";
import { extractErrors } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../../../core/cache-config";

export const createItem = async (
  payload: {
    name: string;
    bucketId: string;
    projectId: string;
  } & Partial<Omit<ItemPayload, "name" | "bucketId">>
) => {
  try {
    const result = await post<Item>("/v1/items/create", payload);
    revalidateTag(CACHE_TAGS.PROJECT.ITEMS(payload.projectId));
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(payload.bucketId));
    return result;
  } catch (error) {
    console.error("Error creating item:", error);
    throw new Error(extractErrors(error));
  }
};

export const updateItem = async (
  payload: Pick<ItemPayload, "id"> &
    Partial<Omit<ItemPayload, "id" | "bucketId">>
) => {
  try {
    const { id, ...rest } = payload;
    const result = await put<Item>(`/v1/items/${id}`, rest);
    revalidateTag(CACHE_TAGS.PROJECT.ITEMS(result.bucket.project.id));
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(result.bucket.id));
    revalidateTag(CACHE_TAGS.ITEM.ONE(id));
    return result;
  } catch (error) {
    console.error(`Error updating item ${payload.id}:`, error);
    throw new Error(extractErrors(error));
  }
};

export const deleteItem = async (
  payload: Pick<ItemPayload, "id" | "bucketId"> & { projectId: string }
) => {
  try {
    await del<void>(`/v1/items/${payload.id}`);
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(payload.bucketId));
    revalidateTag(CACHE_TAGS.PROJECT.ITEMS(payload.projectId));
    return true;
  } catch (error) {
    console.error(`Error deleting item ${payload.id}:`, error);
    throw new Error(extractErrors(error));
  }
};

export const moveItem = async (payload: ItemDnDPayload) => {
  try {
    const { id, ...rest } = payload;
    if (rest.prevItemId === null) {
      delete (rest as { prevItemId?: string | null }).prevItemId;
    }
    if (rest.nextItemId === null) {
      delete (rest as { nextItemId?: string | null }).nextItemId;
    }
    const result = await put<Item>(`/v1/items/${id}/change_bucket`, rest);
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(result.bucket.id));
    revalidateTag(CACHE_TAGS.PROJECT.ITEMS(result.bucket.project.id));
    revalidateTag(CACHE_TAGS.ITEM.ONE(id));
    return result;
  } catch (error) {
    console.error("Error moving item:", error);
    throw new Error(extractErrors(error));
  }
};

export const reorderItems = async (
  payload: Omit<ItemDnDPayload, "bucketId">
) => {
  try {
    const { id, ...rest } = payload;
    if (rest.prevItemId === null) {
      delete (rest as { prevItemId?: string | null }).prevItemId;
    }
    if (rest.nextItemId === null) {
      delete (rest as { nextItemId?: string | null }).nextItemId;
    }
    const result = await put<Item>(`/v1/items/${id}/reorder`, rest);
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(result.bucket.id));
    revalidateTag(CACHE_TAGS.PROJECT.ITEMS(result.bucket.project.id));
    revalidateTag(CACHE_TAGS.ITEM.ONE(id));
    return result;
  } catch (error) {
    console.error("Error reordering items:", error);
    throw new Error(extractErrors(error));
  }
};
