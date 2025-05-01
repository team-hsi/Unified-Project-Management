"use server";
import { ItemDnDPayload, ItemPayload } from "@/feature/shared/@types/item";
import { extractErrors } from "@/lib/utils";
const API = process.env.NEXT_PUBLIC_API_URL;

/*
 * get all items
 */
export const getAllItems = async () => {
  const res = await fetch(`${API}/v1/items/getall`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * get item by id
 */
export const getItem = async (payload: Pick<ItemPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/items/${id}`);
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * create new item
 */
export const createItem = async (payload: Omit<ItemPayload, "id">) => {
  const res = await fetch(`${API}/v1/items/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

// todo: updateItemInline renamed to updateItem
/*
 * update item
 */
export const updateItem = async (payload: Omit<ItemPayload, "bucketId">) => {
  const { id, ...rest } = payload;
  const res = await fetch(`${API}/v1/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const data = await res.json();
    return {
      success: false,
      error: extractErrors(data.error),
    };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * delete item
 */
export const deleteItem = async (payload: Pick<ItemPayload, "id">) => {
  const { id } = payload;
  const res = await fetch(`${API}/v1/items/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }

  return { success: true };
};

/*
 * change item bucket
 */
export const moveItem = async (payload: ItemDnDPayload) => {
  const { id, ...rest } = payload;
  if (rest.prevItemId === null) {
    delete (rest as { prevItemId?: string | null }).prevItemId;
  }
  if (rest.nextItemId === null) {
    delete (rest as { nextItemId?: string | null }).nextItemId;
  }
  const res = await fetch(`${API}/v1/items/${id}/change_bucket`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * reorder item
 */
export const reorderItem = async (
  payload: Omit<ItemDnDPayload, "bucketId">
) => {
  const { id, ...rest } = payload;

  if (rest.prevItemId === null) {
    delete (rest as { prevItemId?: string | null }).prevItemId;
  }
  if (rest.nextItemId === null) {
    delete (rest as { nextItemId?: string | null }).nextItemId;
  }
  const res = await fetch(`${API}/v1/items/${id}/reorder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: extractErrors(data.error) };
  }
  const data = await res.json();
  return { success: true, data };
};

/*
 * create sub item
 */
export const createSubItem = async () => {};
