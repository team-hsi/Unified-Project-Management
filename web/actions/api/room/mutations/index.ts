"use server";
import { Room, RoomPayload } from "@/feature/shared/@types/room";
import { post, put, del } from "../../../core/api-client";
import { extractErrors } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "../../../core/cache-config";

export const createRoom = async (
  payload: Pick<RoomPayload, "name" | "spaceId">
) => {
  try {
    const result = await post<Room>("/v1/rooms/create", payload);
    revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(payload.spaceId));
    return result;
  } catch (error) {
    console.error("Error creating room", error);
    throw new Error(extractErrors(error));
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
    console.error("Error updating room", error);
    throw new Error(extractErrors(error));
  }
};

export const deleteRoom = async (payload: Pick<RoomPayload, "id">) => {
  //todo: add spaceId to payload
  try {
    const result = await del<void>(`/v1/rooms/${payload.id}`);
    // revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(payload.spaceId));
    return result;
  } catch (error) {
    console.error("Error deleting room", error);
    throw new Error(extractErrors(error));
  }
};

export const addRoomMember = async (
  payload: Omit<RoomPayload, "name" | "spaceId">
) => {
  //todo: res doesn't have spaceId => " "
  try {
    const { id, ...rest } = payload;
    const result = await post<Room>(`/v1/rooms/${id}/members/add`, rest);
    revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(result.spaceId));
    revalidateTag(CACHE_TAGS.ROOM.ONE(id));
    revalidateTag(CACHE_TAGS.ROOM.MEMBERS(id));
    return result;
  } catch (error) {
    console.error("Error adding room member", error);
    throw new Error(extractErrors(error));
  }
};

export const removeRoomMember = async (
  payload: Pick<RoomPayload, "id" | "userId">
) => {
  //todo: add spaceId to payload
  try {
    const { id, userId } = payload;
    const result = await del<void>(`/v1/rooms/${id}/members/remove`, { userId });
    // revalidateTag(CACHE_TAGS.WORKSPACE.ROOMS(result.spaceId));
    revalidateTag(CACHE_TAGS.ROOM.ONE(id));
    revalidateTag(CACHE_TAGS.ROOM.MEMBERS(id));
    return result;
  } catch (error) {
    console.error("Error removing room member", error);
    throw new Error(extractErrors(error));
  }
};
