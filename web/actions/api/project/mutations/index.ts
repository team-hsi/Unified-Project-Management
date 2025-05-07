"use server";
import { revalidateTag } from "next/cache";
import { Project, ProjectPayload } from "@/feature/shared/@types/projects";
import { del, post, put } from "@/actions/core/api-client";
import { CACHE_TAGS } from "@/actions/core/cache-config";
import { handleError } from "@/lib/errors";

export const createProject = async (
  payload: Pick<ProjectPayload, "name" | "spaceId">
) => {
  try {
    const result = await post<Project>("/v1/projects/create", payload);
    revalidateTag(CACHE_TAGS.WORKSPACE.PROJECTS(payload.spaceId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};
// TODO: improve error handling
export const updateProject = async (
  payload: Pick<ProjectPayload, "name" | "id">
) => {
  try {
    const { id, ...rest } = payload;
    const result = await put<Project>(`/v1/projects/${id}`, rest);
    revalidateTag(CACHE_TAGS.WORKSPACE.PROJECTS(result.space));
    revalidateTag(CACHE_TAGS.PROJECT.ONE(id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteProject = async (
  payload: Pick<ProjectPayload, "id" | "spaceId">
) => {
  try {
    await del<void>(`/v1/projects/${payload.id}`);
    revalidateTag(CACHE_TAGS.WORKSPACE.PROJECTS(payload.spaceId));
  } catch (error) {
    return handleError(error);
  }
};
