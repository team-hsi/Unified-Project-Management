"use server";
import { getSession } from "./dal";
import { RoomPayload } from "@/@types/room";
import { extractErrors } from "@/lib/utils";
const API = process.env.NEXT_PUBLIC_API_URL;
/*
 * get all rooms
 */
export const getAllRooms = async () => {
  const res = await fetch(`${API}/v1/rooms/getAll`);
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true, data };
};

/*
 * get room by id
 */
export const getRoomById = async (payload: Pick<RoomPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/rooms/${id}`);
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true, data };
};

/*
 * create room
 */
export const createRoom = async (payload: Pick<RoomPayload, "name">) => {
  const session = await getSession();

  const res = await fetch(`${API}/v1/rooms/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
    body: JSON.stringify({ ...payload, spaceId: session.activeSpace }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true, data };
};

/*
 * update room by id
 */
export const updateRoomById = async (payload: RoomPayload) => {
  const { id, name } = payload;
  const session = await getSession();
  const res = await fetch(`${API}/v1/rooms/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true, data };
};

/*
 * get room messages
 */
export const getRoomMessages = async (payload: Pick<RoomPayload, "id">) => {
  const { id } = payload;
  const session = await getSession();
  const res = await fetch(`${API}/v1/rooms/${id}/messages`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(extractErrors(data.error));
  }
  return data;
};

/*
 * delete room by id
 */
export const deleteRoom = async (payload: Pick<RoomPayload, "id">) => {
  const { id } = payload;
  const session = await getSession();
  const res = await fetch(`${API}/v1/rooms/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true };
};
