"use server";

import { PartialProject } from "@/components/project/types";

const API = process.env.NEXT_PUBLIC_API_URL;
export const getItems = async () => {
  try {
    const res = await fetch(`${API}/v1/items/getall`);
    if (!res.ok) {
      throw new Error(`Error fetching tasks: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createItem = async (values: PartialProject) => {
  const res = await fetch(`${API}/v1/items/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: values.name,
      description: values.description,
      bucketId: values.id,
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to create project");
  }
  return res.json();
};
