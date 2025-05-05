"use server";

import { post, put, del } from "../../../core/api-client";
import { Bucket, BucketPayload } from "@/feature/shared/@types/bucket";
import { extractErrors } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../../../core/cache-config";

export const createBucket = async (
  payload: Pick<BucketPayload, "name" | "projectId" | "color">
) => {
  try {
    const result = await post<Bucket>("/v1/buckets/create", payload);
    revalidateTag(CACHE_TAGS.PROJECT.BUCKETS(payload.projectId));
    return result;
  } catch (error) {
    console.error("Error creating bucket:", error);
    throw new Error(extractErrors(error));
  }
};
// BUG : Bucket Color is not updating in the backend
export const updateBucket = async (
  payload: Pick<BucketPayload, "id" | "name" | "color">
) => {
  const { id, ...rest } = payload;
  try {
    const result = await put<Bucket>(`/v1/buckets/${id}`, rest);
    revalidateTag(CACHE_TAGS.PROJECT.BUCKETS(result.project.id));
    revalidateTag(CACHE_TAGS.BUCKET.ONE(id));
    return result;
  } catch (error) {
    console.error(`Error updating bucket ${id}:`, error);
    throw new Error(extractErrors(error));
  }
};

export const deleteBucket = async (
  payload: Pick<BucketPayload, "id" | "projectId">
) => {
  try {
    const result = await del<void>(`/v1/buckets/${payload.id}`);
    revalidateTag(CACHE_TAGS.PROJECT.BUCKETS(payload.projectId));
    return result;
  } catch (error) {
    console.error(`Error deleting bucket ${payload.id}:`, error);
    throw new Error(extractErrors(error));
  }
};
