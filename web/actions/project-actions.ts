"use server";

import type { PartialProject } from "@/components/project/types";
import { notFound } from "next/navigation";
import { verifySession } from "./dal";
import { cache } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export const getProjects = async () => {
  const res = await fetch(`${API}/v1/projects/getall`);
  return { data: await res.json() };
};
export const getProject = cache(async (id: string) => {
  const res = await fetch(`${API}/v1/projects/${id}`);
  if (!res.ok) {
    if (res.status === 400) {
      notFound();
    } else {
      const data = await res.json();
      return { success: false, error: data.error };
    }
  }
  const data = await res.json();
  return { success: true, data };
});
export const getUserProjects = async () => {
  const session = await verifySession();
  const res = await fetch(`${API}/v1/users/${session.userId}/projects`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  const data = await res.json();
  return { success: true, data };
};

export const createProject = async (values: PartialProject) => {
  const session = await verifySession();
  console.log(session);
  console.log(values);
  const res = await fetch(`${API}/v1/projects/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
    body: JSON.stringify({ name: values.name }),
  });
  if (!res.ok) {
    console.log(await res.json());
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
