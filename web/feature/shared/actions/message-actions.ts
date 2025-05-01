"use server";
import { MessagePayload } from "@/feature/shared/@types/message";
import { getSession } from "./dal";
import { extractErrors } from "@/lib/utils";
const API = process.env.NEXT_PUBLIC_API_URL;
/*
 * get all messages
 */
export const getAllMessages = async () => {
  const res = await fetch(`${API}/v1/messages/getAll`);
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true, data };
};

/*
 * get message by id
 */
export const getMessageById = async (payload: Pick<MessagePayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/messages/${id}`);
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true, data };
};

/*
 * send message
 */
export const sendMessage = async (payload: Omit<MessagePayload, "id">) => {
  const session = await getSession();

  const res = await fetch(`${API}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true, data };
};
