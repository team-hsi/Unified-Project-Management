"use server";
import { extractErrors } from "@/lib/utils";
import { get } from "@/actions/core/api-client";
import {
  Project,
  ProjectMatrix,
  ProjectPayload,
  ProjectWithMembers,
} from "@/feature/shared/@types/projects";
import { cache } from "react";
import { CACHE_LIFE, CACHE_TAGS } from "../../../core/cache-config";
// import { handleError } from "@/lib/errors";

export const getAllProjects = async () => {
  try {
    return await get<Project[]>("/projects/getAll");
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error(extractErrors(error));
  }
};

export const getWorkspaceProjects = async (
  payload: Pick<ProjectPayload, "id">
) => {
  try {
    const { id } = payload;
    return await get<Project[]>(`/spaces/${id}/projects`, {
      next: {
        revalidate: CACHE_LIFE.MEDIUM,
        tags: [CACHE_TAGS.WORKSPACE.PROJECTS(id)],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error("Error fetching workspace projects:", error);
    throw new Error(extractErrors(error));
  }
};

export const getProjectMatrix = async (payload: Pick<ProjectPayload, "id">) => {
  const { id } = payload;
  return await get<ProjectMatrix>(`/projects/${id}/metrics`, {
    next: {
      revalidate: CACHE_LIFE.MEDIUM,
      tags: [CACHE_TAGS.PROJECT.MATRIX(id)],
    },
    cache: "force-cache",
  });
};

export const getProjectById = cache(
  async (payload: Pick<ProjectPayload, "id">) => {
    try {
      return await get<Project>(`/projects/${payload.id}`, {
        next: {
          revalidate: CACHE_LIFE.MEDIUM,
          tags: [CACHE_TAGS.PROJECT.ONE(payload.id)],
        },
        cache: "force-cache",
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export const getProjectMembers = async (
  payload: Pick<ProjectPayload, "id">
) => {
  try {
    return get<ProjectWithMembers>(`/projects/${payload.id}/members`, {
      next: {
        revalidate: CACHE_LIFE.LONG,
        tags: [CACHE_TAGS.PROJECT.MEMBERS(payload.id)],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    throw new Error(extractErrors(error));
  }
};
