"use server";

import { WorkspacePayload } from "./action-types";
import { getSession } from "./dal";

const API = process.env.NEXT_PUBLIC_API_URL;

export const getUserWorkspaces = async () => {
  const session = await getSession();
  try {
    const res = await fetch(`${API}/v1/users/${session.userId}/spaces`);
    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error };
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createWorkspace = async (
  payload: Pick<WorkspacePayload, "name" | "description">
) => {
  const session = await getSession();
  const res = await fetch(`${API}/v1/spaces/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  const data = await res.json();
  return { success: true, data };
};

export const updateWorkspace = async (payload: WorkspacePayload) => {
  const session = await getSession();
  const { id, ...rest } = payload;
  // Todo: replace id with session.spaceId when backend is ready

  const res = await fetch(`${API}/v1/spaces/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
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

export const deleteWorkspace = async (
  payload: Pick<WorkspacePayload, "id">
) => {
  const session = await getSession();
  const { id } = payload;
  // Todo: replace id with session.spaceId when backend is ready

  const res = await fetch(`${API}/v1/spaces/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  return { success: true };
};
