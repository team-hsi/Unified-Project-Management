"use server";
import { auth } from "@/actions/core/api-client";
import { UserPayload, UserWithToken } from "@/feature/shared/@types/user";
import { createSession, deleteSession } from "@/actions/core/session";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/core/dal";
import { handleError } from "@/lib/errors";
import { getUser } from "../queries";

export const createUser = async (
  payload: Omit<UserPayload, "id" | "activeSpaceId">
) => {
  try {
    const result = await auth<UserWithToken>("/users/create", payload);
    const { user, tokens, privateSpace } = result;
    const session = {
      userId: user.id,
      activeSpace: privateSpace.id || null,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    await createSession(session);
    return { data: user };
  } catch (error) {
    return handleError(error);
  }
};

export const loginUser = async (
  payload: Pick<UserPayload, "email" | "password">
) => {
  try {
    const result = await auth<UserWithToken>(`/users/login`, payload);
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
    return handleError(error);
  }
};

export const logoutUser = async () => {
  await deleteSession();
  redirect("/sign-in");
};

export async function getCurrentSession() {
  const session = await getSession();
  return session;
}

export async function getSessionUser() {
  const user = await getUser();
  return user;
}
