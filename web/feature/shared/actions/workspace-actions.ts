"use server";
import { WorkspacePayload } from "@/feature/shared/@types/space";
import { getSession } from "./dal";
import { extractErrors } from "@/lib/utils";
import { updateUser } from "./user-actions";
import { createSession, SessionPayload } from "./session";
import { cache } from "react";
import { notFound } from "next/navigation";
const API = process.env.NEXT_PUBLIC_API_URL;

/*
 * Fetch all workspaces
 */
export const getAllWorkspaces = async () => {
  try {
    const res = await fetch(`${API}/v1/spaces/getAll`);
    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: extractErrors(data.error) };
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/*
 * Fetch a workspace by ID
 */
export const getWorkspaceById = cache(async (id: string) => {
  const res = await fetch(`${API}/v1/spaces/${id}`);
  const data = await res.json();
  if (res.status === 400) {
    notFound();
  } else {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true, data };
});

/*
 * Fetch all projects in a workspace
 */

export const getWorkspaceProjects = async () => {
  const session = await getSession();
  const res = await fetch(`${API}/v1/spaces/${session.activeSpace}/projects`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * Fetch all rooms in a workspace
 */

export const getWorkspaceRooms = async (
  payload: Pick<WorkspacePayload, "id">
) => {
  const session = await getSession();
  try {
    const { id } = payload;
    const res = await fetch(`${API}/v1/spaces/${id}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.tokens.accessToken}`,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: extractErrors(data.error) };
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/*
 * Create a new workspace
 */

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
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * Update an existing workspace
 */

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
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * Delete a workspace
 */

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
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true };
};

/*
 * get workspace members
 */
export const getWorkspaceMembers = async () => {
  const session = await getSession();
  const res = await fetch(`${API}/v1/spaces/${session.activeSpace}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return data;
};

/*
 * Add workspace members
 */
export const addWorkspaceMembers = async ({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) => {
  const session = await getSession();
  const res = await fetch(
    `${API}/v1/spaces/${session.activeSpace}/members/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.tokens.accessToken}`,
      },
      body: JSON.stringify({ userId, role }),
    }
  );
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * remove workspace members
 */
export const removeWorkspaceMembers = async ({
  userId,
}: {
  userId: string;
}) => {
  const session = await getSession();
  const res = await fetch(
    `${API}/v1/spaces/${session.activeSpace}/members/remove`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.tokens.accessToken}`,
      },
      body: JSON.stringify({ userId }),
    }
  );
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * update active workspace
 */
export const updateActiveWorkspace = async ({
  activeSpace,
}: {
  activeSpace: string;
}) => {
  const session = await getSession();
  const newSession = {
    userId: session.userId,
    activeSpace: activeSpace,
    accessToken: session.tokens.accessToken,
    refreshToken: session.tokens.refreshToken,
  };
  await createSession(newSession as SessionPayload);
  const data = await updateUser({
    activeSpaceId: activeSpace,
  });
  if (!data.success) {
    return { success: false, error: extractErrors(data.error) };
  }

  return { success: true, data: data.data.activeSpace };
};

/*
 * delete active workspace
 */
export const deleteActiveWorkspace = async () => {
  const session = await getSession();
  const newSession = {
    userId: session.userId,
    activeSpace: null,
    accessToken: session.tokens.accessToken,
    refreshToken: session.tokens.refreshToken,
  };
  await createSession(newSession as SessionPayload);
  const data = await updateUser({
    activeSpaceId: null,
  });
  if (!data.success) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true };
};

/*
 * get active workspace
 */
//not working cookie removed from dal
// export const getActiveWorkspace = async () => {
//   const activeSpace = await getActiveWS();
//   return activeSpace;
// };
