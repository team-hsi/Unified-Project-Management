"use server";
import { put } from "@/actions/core/api-client";
import { getSession } from "@/actions/core/dal";
import { createSession, SessionPayload } from "@/actions/core/session";
import { User, UserPayload } from "@/feature/shared/@types/user";
import { extractErrors } from "@/lib/utils";
import { redirect } from "next/navigation";

export const updateUser = async (
  payload: Partial<Omit<UserPayload, "id" | "password">>
) => {
  try {
    const session = await getSession();
    return await put<User>(`/users/${session.userId}`, payload);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error(extractErrors(error));
  }
};
export const updateUserActiveSpace = async (activeSpace: string) => {
  const session = await getSession();
  const newSession = {
    userId: session.userId,
    activeSpace: activeSpace,
    accessToken: session.tokens.accessToken,
    refreshToken: session.tokens.refreshToken,
  };
  await createSession(newSession as SessionPayload);
  try {
    const result = await updateUser({
      activeSpaceId: activeSpace,
    });
    return result.activeSpace;
  } catch (error) {
    console.error(`Error updating workspace ${activeSpace}:`, error);
    throw new Error(extractErrors(error));
  }
};

export const removeUserActiveSpace = async () => {
  const session = await getSession();
  const newSession = {
    userId: session.userId,
    activeSpace: null,
    accessToken: session.tokens.accessToken,
    refreshToken: session.tokens.refreshToken,
  };
  await createSession(newSession as SessionPayload);
  redirect(`/select-workspace`);
  // try{
  //   const result = await updateUser({
  //     activeSpaceId: null,
  //   });
  //   return result.activeSpace;
  // } catch (error) {
  //   console.error(`Error updating workspace ${activeSpace}:`, error);
  //   throw new Error(extractErrors(error));
  // }
};
