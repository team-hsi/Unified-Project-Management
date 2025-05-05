"use server";
import { extractErrors } from "@/lib/utils";
import { auth } from "@/actions/core/api-client";
import { UserPayload, UserWithToken } from "@/feature/shared/@types/user";
import { createSession, deleteSession } from "@/actions/core/session";
import { redirect } from "next/navigation";

export const createUser = async (
  payload: Omit<UserPayload, "id" | "activeSpaceId">
) => {
  try {
    const result = await auth<UserWithToken>("/v1/users/create", payload);
    const { user, tokens } = result;
    const session = {
      userId: user.id,
      activeSpace: user.activeSpace?.id || null,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    await createSession(session);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(extractErrors(error));
  }
};

export const loginUser = async (
  payload: Pick<UserPayload, "email" | "password">
) => {
  try {
    console.log("payload=>", payload);
    const result = await auth<UserWithToken>(`/v1/users/login`, payload);
    const { user, tokens } = result;
    const session = {
      userId: user.id,
      activeSpace: user.activeSpace?.id || null,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    await createSession(session);
    return user;
  } catch (error) {
    console.error(`Error logging in user:`, error);
    throw new Error(extractErrors(error));
  }
};
export const logoutUser = async () => {
  await deleteSession();
  redirect("/sign-in");
};
