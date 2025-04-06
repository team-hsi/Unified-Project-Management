"use server";
import { User } from "@/hooks/auth-hooks";
import { createSession, deleteSession } from "@/actions/session";
import { redirect } from "next/navigation";
const API = process.env.NEXT_PUBLIC_API_URL;

export const signupAction = async (userData: Omit<User, "id">) => {
  const res = await fetch(`${API}/v1/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  const { user, tokens } = await res.json();
  const session = {
    userId: user.id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
  await createSession(session);
  return { success: true, user };
};

export const loginAction = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API}/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) {
    return { success: false, error: "Invalid email or password" };
  }
  const { user, tokens } = await res.json();
  const session = {
    userId: user.id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
  await createSession(session);
  return { success: true, user };
};

export const logoutAction = async () => {
  await deleteSession();
  redirect("/sign-in");
};
