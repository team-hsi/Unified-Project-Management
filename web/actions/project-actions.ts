"use server";

import type { PartialProject } from "@/components/project/types";

const API = process.env.NEXT_PUBLIC_API_URL;

export const getProjects = async () => {
  const res = await fetch(`${API}/v1/projects/getall`);
  return res.json();
};

export const createProject = async (values: PartialProject) => {
  const res = await fetch(`${API}/v1/projects/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: values.name }),
  });
  if (!res.ok) {
    throw new Error("Failed to create project");
  }
  return res.json();
};

export const updateProject = async (values: PartialProject) => {
  const res = await fetch(`${API}/v1/projects/${values.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: values.name,
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to update project");
  }
  return res.json();
};

export const deleteProject = async (values: PartialProject) => {
  const res = await fetch(`${API}/v1/projects/${values.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status === 204) {
    return null;
  }
  return res.json();
};
