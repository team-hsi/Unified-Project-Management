"use server";
import { post, put, del } from "../../../core/api-client";
import {
  Item,
  ItemDnDPayload,
  ItemPayload,
} from "@/feature/shared/@types/item";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../../../core/cache-config";
import { handleError } from "@/lib/errors";

export const createItem = async (
  payload: {
    name: string;
    bucketId: string;
    projectId: string;
  } & Partial<Omit<ItemPayload, "name" | "bucketId">>
) => {
  try {
    const result = await post<Item>("/items/create", payload);
    revalidateTag(CACHE_TAGS.PROJECT.ITEMS(payload.projectId));
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(payload.bucketId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateItem = async (
  payload: Pick<ItemPayload, "id"> &
    Partial<Omit<ItemPayload, "id" | "bucketId">>
) => {
  try {
    const { id, ...rest } = payload;
    const result = await put<Item>(`/items/${id}`, rest);
    revalidateTag(CACHE_TAGS.PROJECT.ITEMS(result.bucket.project.id));
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(result.bucket.id));
    revalidateTag(CACHE_TAGS.ITEM.ONE(id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteItem = async (
  payload: Pick<ItemPayload, "id" | "bucketId"> & { projectId: string }
) => {
  try {
    await del<void>(`/items/${payload.id}`);
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(payload.bucketId));
    revalidateTag(CACHE_TAGS.PROJECT.ITEMS(payload.projectId));
    return true;
  } catch (error) {
    return handleError(error);
  }
};

export const moveItem = async (
  payload: ItemDnDPayload & { projectId: string; srcBucketId: string }
) => {
  try {
    const { id, projectId, srcBucketId, ...rest } = payload;
    if (rest.prevItemId === null) {
      delete (rest as { prevItemId?: string | null }).prevItemId;
    }
    if (rest.nextItemId === null) {
      delete (rest as { nextItemId?: string | null }).nextItemId;
    }
    const result = await put<Item>(`/items/${id}/change_bucket`, rest);
    revalidateTag(CACHE_TAGS.PROJECT.ITEMS(projectId));
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(payload.bucketId));
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(srcBucketId));
    revalidateTag(CACHE_TAGS.ITEM.ONE(id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const reorderItems = async (
  payload: ItemDnDPayload & { projectId: string }
) => {
  try {
    const { id, projectId, bucketId, ...rest } = payload;
    if (rest.prevItemId === null) {
      delete (rest as { prevItemId?: string | null }).prevItemId;
    }
    if (rest.nextItemId === null) {
      delete (rest as { nextItemId?: string | null }).nextItemId;
    }
    const result = await put<Item>(`/items/${id}/reorder`, rest);
    revalidateTag(CACHE_TAGS.PROJECT.ITEMS(projectId));
    revalidateTag(CACHE_TAGS.BUCKET.ITEMS(bucketId));
    revalidateTag(CACHE_TAGS.ITEM.ONE(id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};
