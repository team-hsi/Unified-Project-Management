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
    const data = await res.json();
    console.log(data);
    throw new Error(`Error fetching tasks: ${data.error}`);
  }
  return res.json();
};

export const updateItemInline = async (values: UpdateItemPayload) => {
  const { id, ...rest } = values;
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

    // Extract nested error messages if present
    const errorMessages =
      data.error?._errors ||
      Object.values(data.error || {}).flatMap(
        (field) => (field as { _errors?: string[] })._errors || []
      );
    console.log("Extracted error messages:", errorMessages);

    return {
      success: false,
      error: errorMessages.length ? errorMessages : data.error,
    };
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

export const editItem = async (itemId: string, values: PartialProject) => {
  try {
    const res = await fetch(`${API}/v1/items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        bucketId: values.id,
        startDate: values.startDate,
        dueDate: values.dueDate,
        priority: values.priority,
        status: values.status,
      }),
    });

    if (!res.ok) {
      throw new Error(`Error updating item: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Failed to edit item ${itemId}:`, error);
    throw error;
  }
};

export const deleteItem = async (itemId: string) => {
  try {
    const res = await fetch(`${API}/v1/items/${itemId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Error deleting item: ${res.statusText}`);
    }

    // Some APIs return nothing on successful DELETE, others return data
    // Adjust based on your API's behavior
    return res.status === 204 ? null : res.json();
  } catch (error) {
    console.error(`Failed to delete item ${itemId}:`, error);
    throw error;
  }
};
