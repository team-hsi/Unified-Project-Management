"use server";
import { createSession, deleteSession } from "@/actions/session";
import { redirect } from "next/navigation";
import { getSession } from "./dal";
import { UserPayload } from "@/@types/user";
import { extractErrors } from "@/lib/utils";
const API = process.env.NEXT_PUBLIC_API_URL;

/*
 * create a new user
 */
export const userCreate = async (
  payload: Omit<UserPayload, "id" | "activeSpaceId">
) => {
  const res = await fetch(`${API}/v1/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const { user, tokens } = await res.json();
  const session = {
    userId: user.id,
    activeSpace: user.activeSpace.id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
  await createSession(session);
  return { success: true, user };
};

/*
 * login user
 */
export const userLogin = async (
  payload: Pick<UserPayload, "email" | "password">
) => {
  const res = await fetch(`${API}/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { success: false, error: "Invalid email or password" };
  }
  const { user, tokens } = await res.json();
  const session = {
    userId: user.id,
    activeSpace: user.activeSpace.id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
  await createSession(session);
  return { success: true, user };
};

/*
 * get user workspaces by user id
 */
export const getUserWorkspaces = async () => {
  const session = await getSession();
  const res = await fetch(`${API}/v1/users/${session.userId}/spaces`);
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true, data };
};

/*
 * get authenticated user projects
 */
export const getUserProjects = async () => {
  const session = await getSession();
  const res = await fetch(`${API}/v1/users/projects`, {
    headers: {
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * get user projects by user id
 */
export const getUserProjectsById = async (payload: Pick<UserPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/users/${id}/projects`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * get current user
 */
export const getCurrentUser = async () => {
  const session = await getSession();
  const res = await fetch(`${API}/v1/users/getcurrentuser`, {
    headers: {
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const user = await res.json();
  return { success: true, user };
};

/*
 * get user by id
 */
export const getUserById = async (payload: Pick<UserPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/users/${id}`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * get all users
 */
export const getAllUsers = async () => {};

/*
 * update user
 */
export const updateUser = async (
  payload: Partial<Omit<UserPayload, "id" | "password">>
) => {
  const session = await getSession();
  const res = await fetch(`${API}/v1/users/${session.userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * delete user
 */
export const deleteUser = async () => {};

/*
 * change user password
 */
export const changeUserPassword = async () => {};

/*
 * logout user
 */
export const userLogout = async () => {
  await deleteSession();
  redirect("/sign-in");
};
