"use server";
import { LabelPayload } from "@/feature/shared/@types/label";
import { extractErrors } from "@/lib/utils";
const API = process.env.NEXT_PUBLIC_API_URL;

/*
 * get all labels
 */
export const getAllLabels = async () => {
  const res = await fetch(`${API}/v1/labels/getall`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * get label by id
 */
export const getLabelById = async (payload: Pick<LabelPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/labels/${id}`);

  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * create label
 */
export const createLabel = async (payload: Omit<LabelPayload, "id">) => {
  const res = await fetch(`${API}/v1/labels/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * update label
 */
export const updateLabel = async (payload: Omit<LabelPayload, "projectId">) => {
  const { id, ...rest } = payload;
  const res = await fetch(`${API}/v1/labels/${id}`, {
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
 * delete label
 */
export const deleteLabel = async (payload: Pick<LabelPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/labels/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }

  return { success: true };
};
