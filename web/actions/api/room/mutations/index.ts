"use server";
import { Room, RoomPayload } from "@/feature/shared/@types/room";
import { post, put, del } from "@/actions/core/api-client";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/actions/core/cache-config";
import { handleError } from "@/lib/errors";
import { getSession } from "@/actions/core/dal";

export const createRoom = async (
  payload: Pick<RoomPayload, "name" | "spaceId">
) => {
  try {
    const session = await getSession();
    const result = await post<Room>("/rooms/create", payload);
    revalidateTag(CACHE_TAGS.USER.ROOMS(session.userId as string));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateRoom = async (payload: Pick<RoomPayload, "id" | "name">) => {
  try {
    const { id, ...rest } = payload;
    const session = await getSession();
    const result = await put<Room>(`/rooms/${id}`, rest);
    revalidateTag(CACHE_TAGS.USER.ROOMS(session.userId as string));
    revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(result.spaceId));
    revalidateTag(CACHE_TAGS.ROOM.ONE(payload.id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteRoom = async (payload: Pick<RoomPayload, "id">) => {
  try {
    const session = await getSession();
    const result = await del<void>(`/rooms/${payload.id}`);
    // revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(result.spaceId));
    revalidateTag(CACHE_TAGS.USER.ROOMS(session.userId as string));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const addRoomMember = async (
  payload: Omit<RoomPayload, "name" | "spaceId">
) => {
  // BUG: res doesn't have spaceId => " "
  try {
    const { id, ...rest } = payload;
    const result = await post<Room>(`/rooms/${id}/members/add`, rest);
    revalidateTag(CACHE_TAGS.ROOM.MEMBERS(id));
    revalidateTag(CACHE_TAGS.ROOM.ONE(id));
    // revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(result.spaceId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const removeRoomMember = async (
  payload: Pick<RoomPayload, "id" | "userId">
) => {
  // BUG: res doesn't have spaceId => " "
  try {
    const { id, userId } = payload;
    const result = await del<Room>(`/rooms/${id}/members/remove`, {
      userId,
    });
    revalidateTag(CACHE_TAGS.USER.ROOMS(userId));
    revalidateTag(CACHE_TAGS.ROOM.MEMBERS(id));
    revalidateTag(CACHE_TAGS.ROOM.ONE(id));
    // revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(spaceId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};
