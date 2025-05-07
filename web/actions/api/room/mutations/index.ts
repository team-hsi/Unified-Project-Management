"use server";
import { Room, RoomPayload } from "@/feature/shared/@types/room";
import { post, put, del } from "@/actions/core/api-client";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/actions/core/cache-config";
import { handleError } from "@/lib/errors";

export const createRoom = async (
  payload: Pick<RoomPayload, "name" | "spaceId">
) => {
  try {
    const result = await post<Room>("/v1/rooms/create", payload);
    revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(payload.spaceId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const updateRoom = async (payload: Pick<RoomPayload, "id" | "name">) => {
  try {
    const { id, ...rest } = payload;
    const result = await put<Room>(`/v1/rooms/${id}`, rest);
    revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(result.spaceId));
    revalidateTag(CACHE_TAGS.ROOM.ONE(payload.id));
    return result;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteRoom = async (
  payload: Pick<RoomPayload, "id" | "spaceId">
) => {
  try {
    const result = await del<void>(`/v1/rooms/${payload.id}`);
    revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(payload.spaceId));
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
    const result = await post<Room>(`/v1/rooms/${id}/members/add`, rest);
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
    const result = await del<Room>(`/v1/rooms/${id}/members/remove`, {
      userId,
    });
    revalidateTag(CACHE_TAGS.ROOM.MEMBERS(id));
    revalidateTag(CACHE_TAGS.ROOM.ONE(id));
    // revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(spaceId));
    return result;
  } catch (error) {
    return handleError(error);
  }
};
