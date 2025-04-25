"use server";
import { getSession, getUser } from "./dal";

export async function getCurrentSession() {
  const session = await getSession();
  return session;
}
export async function getSessionUser() {
  const user = await getUser();
  return user;
}
