"use server";

import { PartialProject } from "@/components/project/types";
import { BucketPayload } from "./action-types";

const API = process.env.NEXT_PUBLIC_API_URL;
export const getBuckets = async () => {
  try {
    const res = await fetch(`${API}/v1/buckets/getall`);
    if (!res.ok) {
      throw new Error(`Error fetching tasks: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createBucket = async ({
  id,
  name,
  color,
}: {
  id: string;
  name: string;
  color: string;
}) => {
  const res = await fetch(`${API}/v1/buckets/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      color,
      projectId: id,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  const data = await res.json();
  return { success: true, data };
};

export const updateBucket = async (payload: BucketPayload) => {
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
    return { success: false, error: data.error };
  }
  const data = await res.json();
  return { success: true, data };
};

export const deleteBucket = async ({ id }: { id: string }) => {
  const res = await fetch(`${API}/v1/buckets/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  return { success: true };
};

export const getProjectBuckets = async ({ id }: PartialProject) => {
  const res = await fetch(`${API}/v1/projects/${id}/buckets`);
  if (!res.ok) {
    throw new Error(`Error fetching tasks: ${res.statusText}`);
  }
  return res.json();
};
