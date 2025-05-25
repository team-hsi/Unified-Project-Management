"use server";

import { post, put, del } from "@/actions/core/api-client";
import { Bucket, BucketPayload } from "@/feature/shared/@types/bucket";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/actions/core/cache-config";
import { handleError } from "@/lib/errors";
export const createBucket = async (
  payload: Pick<BucketPayload, "name" | "projectId" | "color">
) => {
  try {
    const result = await post<Bucket>("/buckets/create", payload);
    revalidateTag(CACHE_TAGS.PROJECT.BUCKETS(payload.projectId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateBucket = async (
  payload: Pick<BucketPayload, "id" | "name" | "color">
) => {
  const { id, ...rest } = payload;
  try {
    const result = await put<Bucket>(`/buckets/${id}`, rest);
    revalidateTag(CACHE_TAGS.PROJECT.BUCKETS(result.project.id));
    revalidateTag(CACHE_TAGS.BUCKET.ONE(id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteBucket = async (
  payload: Pick<BucketPayload, "id" | "projectId">
) => {
  try {
    const result = await del<void>(`/buckets/${payload.id}`);
    revalidateTag(CACHE_TAGS.PROJECT.BUCKETS(payload.projectId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};
