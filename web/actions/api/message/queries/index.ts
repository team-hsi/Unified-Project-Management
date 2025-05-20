"use server";
import { Chat, RoomPayload } from "@/feature/shared/@types/room";
import { get } from "../../../core/api-client";
import { extractErrors } from "@/lib/utils";
import { Message, MessagePayload } from "@/feature/shared/@types/message";

export const getAllMessages = async () => {
  try {
    return await get<Message[]>(`/messages/getAll`);
  } catch (error) {
    console.error("Error fetching all messages", error);
    throw new Error(extractErrors(error));
  }
};

export const getRoomMessages = async (payload: Pick<RoomPayload, "id">) => {
  try {
    return await get<Chat>(`/rooms/${payload.id}/messages`);
  } catch (error) {
    console.error("Error fetching room by id", error);
    throw new Error(extractErrors(error));
  }
};

export const getMessageById = async (payload: Pick<MessagePayload, "id">) => {
  try {
    return await get<Message>(`/messages/${payload.id}`);
  } catch (error) {
    console.error("Error fetching message by id", error);
    throw new Error(extractErrors(error));
  }
};
