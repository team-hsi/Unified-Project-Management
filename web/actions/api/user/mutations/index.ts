"use server";
import { post, put } from "@/actions/core/api-client";
import { CACHE_TAGS } from "@/actions/core/cache-config";
import { getSession } from "@/actions/core/dal";
import { createSession, SessionPayload } from "@/actions/core/session";
import { User, UserPayload } from "@/feature/shared/@types/user";
import { handleError } from "@/lib/errors";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const updateUser = async (
  payload: Partial<Omit<UserPayload, "id" | "password">>
) => {
  try {
    const session = await getSession();
    return await put<User>(`/users/${session.userId}`, payload);
  } catch (error) {
    return handleError(error);
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
  await updateUser({
    activeSpaceId: activeSpace,
  });
  await createSession(newSession as SessionPayload);
  return true;
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

export const acceptInvite = async (payload: {
  inviteId: string;
  inviterId: string;
}) => {
  try {
    const session = await getSession();
    await post(`/spaces/invites/${payload.inviteId}/accept`, {
      inviteId: payload.inviteId,
    });
    revalidateTag(CACHE_TAGS.USER.WORKSPACES(session.userId as string));
    revalidateTag(CACHE_TAGS.USER.WORKSPACES(payload.inviterId));
    return true;
  } catch (error) {
    console.error(`Error accepting invite`, error);
    return handleError(error);
  }
};
