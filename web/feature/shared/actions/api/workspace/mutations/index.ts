"use server";

import { post, put, del } from "../../../core/api-client";
import {
  Workspace,
  WorkspacePayload,
  WorkspaceWithMembers,
} from "@/feature/shared/@types/space";
import { MemberPayload } from "@/feature/shared/@types/user";
import { extractErrors } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../../../core/cache-config";
import { getSession } from "../../../core/dal";


export const createWorkspace = async (
  payload: Pick<WorkspacePayload, "name" | "description">
) => {
  try {
    const session = await getSession();
    const result = await post<Workspace>("/v1/spaces/create", payload);
    revalidateTag(CACHE_TAGS.USER.WORKSPACES(session.userId as string));
    return result;
  } catch (error) {
    console.error("Error creating workspace:", error);
    throw new Error(extractErrors(error));
  }
};

export const updateWorkspace = async (payload: WorkspacePayload) => {
  try {
    const { id, ...rest } = payload;
    const session = await getSession();
    const result = await put<Workspace>(`/v1/spaces/${id}`, rest);
    revalidateTag(CACHE_TAGS.USER.WORKSPACES(session.userId as string));
    revalidateTag(CACHE_TAGS.WORKSPACE.ONE(id));
    return result;
  } catch (error) {
    console.error(`Error updating workspace ${payload.id}:`, error);
    throw new Error(extractErrors(error));
  }
};
// Todo: replace id with session.spaceId when backend is ready
export const deleteWorkspace = async (id: string) => {
  try {
    const session = await getSession();
    const result = await del<void>(`/v1/spaces/${id}`);
    revalidateTag(CACHE_TAGS.USER.WORKSPACES(session.userId as string));
    return result;
  } catch (error) {
    console.error(`Error deleting workspace ${id}:`, error);
    throw error;
  }
};

export const addWorkspaceMembers = async (payload: MemberPayload) => {
  try {
    const result = await post<WorkspaceWithMembers>(
      `/v1/spaces/${payload.id}/members/add`,
      payload
    );
    revalidateTag(CACHE_TAGS.WORKSPACE.MEMBERS(payload.id));
    return result;
  } catch (error) {
    console.error("Error adding workspace members:", error);
    throw new Error(extractErrors(error));
  }
};

export const removeWorkspaceMembers = async (
  payload: Pick<MemberPayload, "id" | "userId">
) => {
  try {
    const { id, userId } = payload;
    const result = await post<void>(`/v1/spaces/${id}/members/remove`, { userId });
    revalidateTag(CACHE_TAGS.WORKSPACE.MEMBERS(id));
    return result;
  } catch (error) {
    console.error("Error removing workspace members:", error);
    throw new Error(extractErrors(error));
  }
};

// /*
//  * update active workspace
//  */
// export const updateActiveWorkspace = async ({
//   activeSpace,
// }: {
//   activeSpace: string;
// }) => {
//   const session = await getSession();
//   const newSession = {
//     userId: session.userId,
//     activeSpace: activeSpace,
//     accessToken: session.tokens.accessToken,
//     refreshToken: session.tokens.refreshToken,
//   };
//   await createSession(newSession as SessionPayload);
//   const data = await updateUser({
//     activeSpaceId: activeSpace,
//   });
//   if (!data.success) {
//     return { success: false, error: extractErrors(data.error) };
//   }

//   return { success: true, data: data.data.activeSpace };
// };

// /*
//  * delete active workspace
//  */
// export const deleteActiveWorkspace = async () => {
//   const session = await getSession();
//   const newSession = {
//     userId: session.userId,
//     activeSpace: null,
//     accessToken: session.tokens.accessToken,
//     refreshToken: session.tokens.refreshToken,
//   };
//   await createSession(newSession as SessionPayload);
//   const data = await updateUser({
//     activeSpaceId: null,
//   });
//   if (!data.success) {
//     return { success: false, error: extractErrors(data.error) };
//   }
//   return { success: true };
// };
