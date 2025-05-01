"use server";
import { BucketPayload } from "@/feature/shared/@types/bucket";
import { extractErrors } from "@/lib/utils";
const API = process.env.NEXT_PUBLIC_API_URL;

/*
 * get all buckets
 */
export const getAllBuckets = async () => {
  const res = await fetch(`${API}/v1/buckets/getall`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * get buckets by project id
 */
export const getBucketById = async (payload: Pick<BucketPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/buckets/${id}`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * create bucket
 */
export const createBucket = async (payload: Omit<BucketPayload, "id">) => {
  console.log("create bucket payload", payload);
  const res = await fetch(`${API}/v1/buckets/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true, data };
};

/*
 * update bucket
 */
// Todo : Bucket Color is not updating in the backend
export const updateBucket = async (
  payload: Omit<BucketPayload, "projectId">
) => {
  const { id, ...rest } = payload;
  const res = await fetch(`${API}/v1/buckets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * get bucket items by bucket id
 */
export const getBucketItemsById = async (
  payload: Pick<BucketPayload, "id">
) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/buckets/${id}/items`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * delete bucket
 */
export const deleteBucket = async (payload: Pick<BucketPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/buckets/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true };
};
