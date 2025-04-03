"use server";
export const getItems = async () => {
  const API = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${API}/v1/items/getall`);
    if (!res.ok) {
      throw new Error(`Error fetching tasks: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
