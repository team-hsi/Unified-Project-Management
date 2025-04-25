"use server";
import { getSession, getUser } from "./dal";

export async function getCurrentSession() {
  return await getSession();
}
export async function getSessionUser() {
  const user = await getUser();
  return user;
}
