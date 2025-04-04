"use server";

import { PartialProject } from "@/components/project/types";

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
  try {
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
      throw new Error("Failed to create bucket");
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateBucket = async ({ id, name }: PartialProject) => {
  try {
    const res = await fetch(`${API}/v1/buckets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      throw new Error("Failed to update bucket");
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteBucket = async ({ id }: { id: string }) => {
  try {
    const res = await fetch(`${API}/v1/buckets/${id}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
      console.log("Bucket deleted successfully");
      return null;
    }
    if (!res.ok || res.status === 404) {
      console.log("Failed to delete bucket");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
