"use server";

import { get } from "@/actions/core/api-client";
import { Workspace } from "@/feature/shared/@types/space";
import { getSession } from "@/actions/core/dal";
import { extractErrors } from "@/lib/utils";
import { cache } from "react";
import { CACHE_LIFE, CACHE_TAGS } from "@/actions/core/cache-config";
import { User, UserPayload } from "@/feature/shared/@types/user";
export const getAllUsers = async () => {
  try {
    return await get<User[]>("/v1/users");
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(extractErrors(error));
  }
};

export const getUserWorkspaces = async () => {
  try {
    const session = await getSession();
    return await get<Workspace[]>(`/v1/users/${session.userId}/spaces`, {
      next: {
        revalidate: CACHE_LIFE.MEDIUM,
        tags: [
          CACHE_TAGS.USER.WORKSPACES(session.userId as string),
          CACHE_TAGS.WORKSPACE.ALL,
        ],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    throw new Error(extractErrors(error));
  }
};

// TODO: cache user if needed
export const getUserById = cache(async (payload: Pick<UserPayload, "id">) => {
  try {
    return await get<User>(`/v1/users/${payload.id}`);
  } catch (error) {
    console.error(`Error fetching user ${payload.id}:`, error);
    throw new Error(extractErrors(error));
  }
});

export const getCurrentUser = async () => {
  try {
    return await get<User>(`/v1/users/getcurrentuser`);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
