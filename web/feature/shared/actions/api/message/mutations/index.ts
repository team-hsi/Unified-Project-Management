import { Message, MessagePayload } from "@/feature/shared/@types/message";
import { post } from "../../../core/api-client";
import { extractErrors } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../../../core/cache-config";

export const createMessage = async (payload: Omit<MessagePayload, "id">) => {
  try {
    const result = await post<Message>("/v1/messages", payload);
    revalidateTag(CACHE_TAGS.ROOM.MESSAGES(payload.roomId));
    return result;
  } catch (error) {
    console.error("Error creating message", error);
    throw new Error(extractErrors(error));
  }
};
