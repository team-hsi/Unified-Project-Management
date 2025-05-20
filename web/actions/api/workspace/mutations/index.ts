"use server";
import { post, put, del } from "@/actions/core/api-client";
import {
  Workspace,
  WorkspacePayload,
  WorkspaceWithMembers,
} from "@/feature/shared/@types/space";
import { MemberPayload, MemberWithSpace } from "@/feature/shared/@types/user";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/actions/core/cache-config";
import { getSession } from "@/actions/core/dal";
import { handleError } from "@/lib/errors";
import { createSession, SessionPayload } from "@/actions/core/session";

export const createWorkspace = async (
  payload: Pick<WorkspacePayload, "name" | "description">
) => {
  try {
    const session = await getSession();
    const result = await post<Workspace>("/spaces/create", payload);
    revalidateTag(CACHE_TAGS.USER.WORKSPACES(session.userId as string));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateWorkspace = async (
  payload: { id: string } & Partial<Omit<WorkspacePayload, "id">>
) => {
  try {
    const { id, ...rest } = payload;
    const session = await getSession();
    const result = await put<Workspace>(`/spaces/${id}`, rest);
    revalidateTag(CACHE_TAGS.USER.WORKSPACES(session.userId as string));
    revalidateTag(CACHE_TAGS.WORKSPACE.ONE(id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};
// Todo: replace id with session.spaceId when backend is ready
export const deleteWorkspace = async (id: string) => {
  try {
    const session = await getSession();
    const result = await del<void>(`/spaces/${id}`);
    revalidateTag(CACHE_TAGS.USER.WORKSPACES(session.userId as string));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const addWorkspaceMembers = async (payload: MemberPayload) => {
  try {
    const result = await post<WorkspaceWithMembers>(
      `/spaces/${payload.id}/members/add`,
      payload
    );
    revalidateTag(CACHE_TAGS.WORKSPACE.MEMBERS(payload.id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateWorkspaceMemberRole = async (payload: MemberPayload) => {
  try {
    const { id, ...rest } = payload;
    console.log("payload=>", payload, `/spaces/${id}/membership`);
    const result = await put<MemberWithSpace>(`/spaces/${id}/membership`, {
      userId: rest.userId,
      role: rest.role,
    });
    revalidateTag(CACHE_TAGS.WORKSPACE.MEMBERS(payload.id));
    console.log("result", result);
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const removeWorkspaceMembers = async (
  payload: Pick<MemberPayload, "id" | "userId">
) => {
  try {
    const { id, userId } = payload;
    const result = await del<void>(`/spaces/${id}/members/remove`, {
      userId,
    });
    revalidateTag(CACHE_TAGS.WORKSPACE.MEMBERS(id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateActiveSpace = async (activeSpace: string) => {
  const session = await getSession();
  const newSession = {
    userId: session.userId,
    activeSpace: activeSpace,
    accessToken: session.tokens.accessToken,
    refreshToken: session.tokens.refreshToken,
  };
  await createSession(newSession as SessionPayload);
};
