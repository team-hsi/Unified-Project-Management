"use server";
import { Chat, RoomPayload } from "@/feature/shared/@types/room";
import { get } from "../../../core/api-client";
import { extractErrors } from "@/lib/utils";
import { Message, MessagePayload } from "@/feature/shared/@types/message";
import { CACHE_LIFE, CACHE_TAGS } from "../../../core/cache-config";

export const getAllMessages = async () => {
  try {
    return await get<Message[]>(`/v1/messages/getAll`);
  } catch (error) {
    console.error("Error fetching all messages", error);
    throw new Error(extractErrors(error));
  }
};

export const getRoomMessages = async (payload: Pick<RoomPayload, "id">) => {
  try {
    return await get<Chat>(`/v1/rooms/${payload.id}/messages`, {
      next: {
        revalidate: CACHE_LIFE.REALTIME,
        tags: [CACHE_TAGS.ROOM.MESSAGES(payload.id)],
      },
      cache: "force-cache",
    });
  } catch (error) {
    console.error("Error fetching room by id", error);
    throw new Error(extractErrors(error));
  }
};

export const getMessageById = async (payload: Pick<MessagePayload, "id">) => {
  try {
    return await get<Message>(`/v1/messages/${payload.id}`);
  } catch (error) {
    console.error("Error fetching message by id", error);
    throw new Error(extractErrors(error));
  }
};
