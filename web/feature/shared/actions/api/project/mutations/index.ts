"use server";

import { revalidateTag } from "next/cache";
import { Project, ProjectPayload } from "@/feature/shared/@types/projects";
import { extractErrors } from "@/lib/utils";
import { del, post, put } from "@/feature/shared/actions/core/api-client";
import { CACHE_TAGS } from "../../../core/cache-config";
import { getSession } from "../../../core/dal";


export const createProject = async (
  payload: Pick<ProjectPayload, "name" | "spaceId">
) => {
  try {
    const result = await post<Project>("/v1/projects/create", payload);
    revalidateTag(CACHE_TAGS.WORKSPACE.PROJECTS(payload.spaceId));
    return result;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error(extractErrors(error));
  }
};
//todo: improve error handling
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
    console.error(`Error updating project ${payload.id}:`, error);
    throw new Error(extractErrors(error));
  }
};

export const deleteProject = async (payload: Pick<ProjectPayload, "id">) => {
  //todo: add spaceId to payload
  try {
    const session = await getSession();
    const { id } = payload;
    await del<void>(`/v1/projects/${id}`);
    revalidateTag(CACHE_TAGS.WORKSPACE.PROJECTS(session.userId as string));
  } catch (error) {
    console.error(`Error deleting project ${payload.id}:`, error);
    throw new Error(extractErrors(error));
  }
};
