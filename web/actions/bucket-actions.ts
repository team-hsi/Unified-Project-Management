// src/actions/column-actions.ts
"use server";

const API = process.env.NEXT_PUBLIC_API_URL;

export const fetchBuckets = async (projectId: string) => {
  const res = await fetch(`${API}/v1/buckets/getall?projectId=${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add Authorization header if required
      // "Authorization": "Bearer your-token-here",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch columns");
  }
  return res.json();
};