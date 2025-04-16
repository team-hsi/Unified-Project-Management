"use server";

import type { UpdateLabelPayload } from "@/actions/action-types";
const API = process.env.NEXT_PUBLIC_API_URL;
export const getLabels = async () => {
  try {
    const res = await fetch(`${API}/v1/labels/getall`);
    if (!res.ok) {
      throw new Error(`Error fetching tasks: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLabelsByProjectId = async (
  values: Pick<UpdateLabelPayload, "projectId">
) => {
  const { projectId } = values;
  const res = await fetch(`${API}/v1/projects/${projectId}/labels`);

  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  const data = await res.json();
  return { success: true, data };
};

export const getLabelById = async (values: Pick<UpdateLabelPayload, "id">) => {
  const { id } = values;
  const res = await fetch(`${API}/v1/labels/${id}`);

  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  const data = await res.json();
  return { success: true, data };
};

export const createLabel = async (values: UpdateLabelPayload) => {
  const res = await fetch(`${API}/v1/labels/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  const data = await res.json();
  return { success: true, data };
};

export const deleteLabel = async (values: Pick<UpdateLabelPayload, "id">) => {
  const { id } = values;
  const res = await fetch(`${API}/v1/labels/${id}`, {
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

export const updateLabel = async (values: UpdateLabelPayload) => {
  const { id, ...rest } = values;
  const res = await fetch(`${API}/v1/labels/${id}`, {
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
