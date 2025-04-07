"use server";

import { PartialProject } from "@/components/project/types";
import type { UpdateItemPayload } from "@/actions/action-types";
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

export const getProjectItems = async ({ id }: PartialProject) => {
  const res = await fetch(`${API}/v1/projects/${id}/items`);
  if (!res.ok) {
    throw new Error(`Error fetching tasks: ${res.statusText}`);
  }
  return res.json();
};

export const updateItemInline = async (values: UpdateItemPayload) => {
  const { id, ...rest } = values;
  //Todo: remove this when the backend is updated to accept null values
  if ("dueDate" in rest) {
    delete rest.dueDate;
  }
  const res = await fetch(`${API}/v1/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    console.log("check type", typeof data.error);
    return { success: false, error: data.error };
  }
  const data = await res.json();
  return { success: true, data };
};

export const createItem = async (values: UpdateItemPayload) => {
  const { id, ...rest } = values;
  const res = await fetch(`${API}/v1/items/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...rest,
      bucketId: id,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  const data = await res.json();
  return { success: true, data };
};

export const deleteItemById = async (values: UpdateItemPayload) => {
  const { id } = values;
  const res = await fetch(`${API}/v1/items/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }

  return { success: true };
};
