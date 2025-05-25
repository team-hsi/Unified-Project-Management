"use server";
import { revalidateTag } from "next/cache";
import {
  Project,
  ProjectPayload,
  ProjectWithMembers,
} from "@/feature/shared/@types/projects";
import { del, post, put } from "@/actions/core/api-client";
import { CACHE_TAGS } from "@/actions/core/cache-config";
import { handleError } from "@/lib/errors";
import { MemberPayload } from "@/feature/shared/@types/user";

export const createProject = async (
  payload: Pick<ProjectPayload, "name" | "spaceId">
) => {
  try {
    const result = await post<Project>("/projects/create", payload);
    revalidateTag(CACHE_TAGS.WORKSPACE.PROJECTS(payload.spaceId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateProject = async (
  payload: Pick<ProjectPayload, "name" | "id">
) => {
  try {
    const { id, ...rest } = payload;
    const result = await put<Project>(`/projects/${id}`, rest);
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
    const { id, spaceId } = payload;
    await del<void>(`/projects/${id}`);
    revalidateTag(CACHE_TAGS.WORKSPACE.PROJECTS(spaceId));
  } catch (error) {
    return handleError(error);
  }
};

export const addProjectMember = async (payload: MemberPayload) => {
  try {
    const { id, ...rest } = payload;
    const result = await post<ProjectWithMembers>(
      `/projects/${id}/members/add`,
      rest
    );
    revalidateTag(CACHE_TAGS.PROJECT.MEMBERS(payload.id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const removeProjectMember = async (
  payload: Pick<MemberPayload, "id" | "userId">
) => {
  try {
    const { id, userId } = payload;
    const result = await del<void>(`/projects/${id}/members/remove`, {
      userId,
    });
    revalidateTag(CACHE_TAGS.PROJECT.MEMBERS(id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};
