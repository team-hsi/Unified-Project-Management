"use server";

import { get } from "../../../core/api-client";
import { Bucket, BucketPayload } from "@/feature/shared/@types/bucket";
import { ProjectPayload } from "@/feature/shared/@types/projects";
import { extractErrors } from "@/lib/utils";
import { CACHE_LIFE, CACHE_TAGS } from "../../../core/cache-config";

export const getAllBuckets = async () => {
  try {
    return await get<Bucket[]>("/buckets/getall");
  } catch (error) {
    console.error("Error fetching all buckets:", error);
    throw new Error(extractErrors(error));
  }
};

export const getProjectBuckets = async (
  payload: Pick<ProjectPayload, "id">
) => {
  try {
    return await get<Bucket[]>(`/projects/${payload.id}/buckets`, {
      next: {
        revalidate: CACHE_LIFE.MINUTE,
        tags: [CACHE_TAGS.PROJECT.BUCKETS(payload.id)],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error(`Error fetching project ${payload.id} buckets:`, error);
    throw new Error(extractErrors(error));
  }
};
export const getBucketById = async (payload: Pick<BucketPayload, "id">) => {
  try {
    return await get<BucketPayload>(`/buckets/${payload.id}`, {
      next: {
        revalidate: CACHE_LIFE.MINUTE,
        tags: [CACHE_TAGS.BUCKET.ONE(payload.id)],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error(`Error fetching bucket ${payload.id}:`, error);
    throw new Error(extractErrors(error));
  }
};
