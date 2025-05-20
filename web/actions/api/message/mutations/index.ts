"use server";
import { Message, MessagePayload } from "@/feature/shared/@types/message";
import { post } from "../../../core/api-client";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../../../core/cache-config";
import { handleError } from "@/lib/errors";

export const createMessage = async (payload: Omit<MessagePayload, "id">) => {
  try {
    const result = await post<Message>("/messages", payload);
    revalidateTag(CACHE_TAGS.ROOM.MESSAGES(payload.roomId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};
