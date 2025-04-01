"use server";
import { ProjectSchema } from "./../components/project/schema";
const API = process.env.NEXT_PUBLIC_API_URL;

export const fetchProjects = async () => {
  const res = await fetch(`${API}/v1/projects/getall`);
  return res.json();
};

export const createProject = async (values: ProjectSchema) => {
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
