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
export const updateRoomById = async (
  payload: Pick<RoomPayload, "id" | "name">
) => {
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

/*
 * get room members
 */
export const getRoomMembers = async (payload: Pick<RoomPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/rooms/${id}/members`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(extractErrors(data.error));
  }
  return data.members;
};

/*
 * add room members
 */
export const addRoomMember = async (payload: Omit<RoomPayload, "name">) => {
  const { id, userId, role } = payload;
  const res = await fetch(`${API}/v1/rooms/${id}/members/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, role }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true };
};

/*
 * remove room member
 */
export const removeRoomMember = async (
  payload: Pick<RoomPayload, "id" | "userId">
) => {
  const { id, userId } = payload;
  console.log("removeRoomMember", payload);
  const res = await fetch(`${API}/v1/rooms/${id}/members/remove`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: extractErrors(data.error) };
  }
  return { success: true };
};
