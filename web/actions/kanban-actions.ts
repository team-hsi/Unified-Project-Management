"use server";
const API = process.env.NEXT_PUBLIC_API_URL;
export const moveItem = async (values: {
  itemId: string;
  prevItemId: string | null;
  nextItemId: string | null;
  bucketId: string;
}) => {
  const { itemId, bucketId, ...rest } = values;
  if (rest.prevItemId === null) {
    delete (rest as { prevItemId?: string | null }).prevItemId;
  }
  if (rest.nextItemId === null) {
    delete (rest as { nextItemId?: string | null }).nextItemId;
  }
  const res = await fetch(`${API}/v1/items/${itemId}/change_bucket`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...rest,
      bucketId,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  const data = await res.json();
  return { success: true, data };
};

export const reorderItem = async (values: {
  itemId: string;
  prevItemId: string | null;
  nextItemId: string | null;
}) => {
  const { itemId, ...rest } = values;

  if (rest.prevItemId === null) {
    delete (rest as { prevItemId?: string | null }).prevItemId;
  }
  if (rest.nextItemId === null) {
    delete (rest as { nextItemId?: string | null }).nextItemId;
  }
  console.log("reorderItem", rest);
  const res = await fetch(`${API}/v1/items/${itemId}/reorder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const data = await res.json();
    return { success: false, error: data.error };
  }
  const data = await res.json();
  console.log("reorderItem res", data);
  return { success: true, data };
};
