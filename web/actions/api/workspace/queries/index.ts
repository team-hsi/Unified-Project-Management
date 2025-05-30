"use server";

import { get } from "../../../core/api-client";
import {
  Workspace,
  WorkspacePayload,
  WorkspaceWithMembers,
} from "@/feature/shared/@types/space";
import { getSession } from "../../../core/dal";
import { extractErrors } from "@/lib/utils";
import { cache } from "react";
import { CACHE_LIFE, CACHE_TAGS } from "../../../core/cache-config";
import { Invitation } from "../../user/queries";
// import { MemberWithSpace } from "@/feature/shared/@types/user";

export const getAllWorkspaces = async () => {
  try {
    return await get<Workspace[]>("/spaces/getAll");
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    throw new Error(extractErrors(error));
  }
};

export const getUserWorkspaces = async () => {
  try {
    const session = await getSession();
    return await get<Workspace[]>(`/users/${session.userId}/spaces`, {
      next: {
        revalidate: CACHE_LIFE.MINUTE,
        tags: [
          CACHE_TAGS.USER.WORKSPACES(session.userId as string),
          CACHE_TAGS.WORKSPACE.ALL,
        ],
      },
      cache: "no-cache",
    });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    throw new Error(extractErrors(error));
  }
};

export const getWorkspaceById = cache(
  async (payload: Pick<WorkspacePayload, "id">) => {
    try {
      return await get<Workspace>(`/spaces/${payload.id}`, {
        next: {
          revalidate: CACHE_LIFE.MINUTE,
          tags: [CACHE_TAGS.WORKSPACE.ONE(payload.id)],
        },
        cache: "no-cache",
      });
    } catch (error) {
      console.error(`Error fetching workspace ${payload.id}:`, error);
      throw new Error(extractErrors(error));
    }
  }
);

export const getWorkspaceMembers = async (
  payload: Pick<WorkspacePayload, "id">
) => {
  try {
    return get<WorkspaceWithMembers>(`/spaces/${payload.id}/members`, {
      next: {
        revalidate: CACHE_LIFE.REALTIME,
        tags: [CACHE_TAGS.WORKSPACE.MEMBERS(payload.id)],
      },
      cache: "no-cache",
    });
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    throw new Error(extractErrors(error));
  }
};

export const getSpaceInviteInfo = async (id: string) => {
  return await get<Invitation>(`/spaces/invites/${id}`);
};
export const getSpaceInvitations = async (id: string) => {
  return await get<Invitation[]>(`/spaces/${id}/invites`);
};

// export const getUserSpaceMembership = async (payload: {
//   userId: string;
//   id: string;
// }) => {
//   try {
//     const { id, userId } = payload;
//     const result = await get<MemberWithSpace>(`/spaces/${id}/membership`);
//     revalidateTag(CACHE_TAGS.WORKSPACE.MEMBERS(payload.id));
//     console.log("result", result);
//     return result;
//   } catch (error) {
//     return handleError(error);
//   }
// };
