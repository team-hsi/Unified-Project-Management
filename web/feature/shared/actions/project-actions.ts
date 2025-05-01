"use server";

import { notFound } from "next/navigation";
import { getSession } from "./dal";
import { cache } from "react";
import { ProjectPayload } from "@/feature/shared/@types/projects";
import { extractErrors } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL;

/*
 * get all projects
 */
export const getAllProjects = async () => {
  const res = await fetch(`${API}/v1/projects/getall`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * get project by id
 */
export const getProject = cache(async (id: string) => {
  const res = await fetch(`${API}/v1/projects/${id}`);
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 400) {
      notFound();
    } else {
      return { success: false, error: extractErrors(data.error) };
    }
  }
  return { success: true, data };
});

/*
 * create new project
 */
export const createProject = async (payload: Omit<ProjectPayload, "id">) => {
  const session = await getSession();
  const res = await fetch(`${API}/v1/projects/create`, {
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
 * update project
 */
//todo: improve error handling
export const updateProject = async (
  payload: Omit<ProjectPayload, "spaceId">
) => {
  const { id, name } = payload;
  const res = await fetch(`${API}/v1/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error("Failed to update project");
    // const data = await res.json();
    // return { success: false, error: extractErrors(data.error) };
  }
  // const data = await res.json();
  // return { success: true, data };
  return res.json();
};

/*
 * delete project
 */
export const deleteProject = async (payload: Pick<ProjectPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true };
};

/*
 * get project buckets by project id
 */
//todo: fix error handling when board route is setup
export const getProjectBuckets = async (
  payload: Pick<ProjectPayload, "id">
) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/projects/${id}/buckets`);
  if (!res.ok) {
    // const data = await res.json();
    // return { success: false, error: extractErrors(data.error) };
    throw new Error(`Error fetching tasks: ${res.statusText}`);
  }
  // const data = await res.json();
  // return { success: true, data };
  return res.json();
};

/*
 * get project items by project id
 */
export const getProjectItems = async (payload: Pick<ProjectPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/projects/${id}/items`);
  if (!res.ok) {
    const data = await res.json();
    console.log(data);
    throw new Error(`Error fetching tasks: ${data.error}`);
  }
  return res.json();
};

/*
 * get project labels by project id
 */
export const getProjectLabels = async (payload: Pick<ProjectPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/projects/${id}/labels`);

  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};
