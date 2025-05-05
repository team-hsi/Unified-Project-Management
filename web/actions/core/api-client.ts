"use server";
import { getSession } from "./dal";
import { extractErrors } from "@/lib/utils";
import { notFound } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;
type FetchOptions = {
  next?: {
    tags?: string[];
    revalidate?: false | 0 | number;
  };
  cache?: "no-store" | "force-cache";
};

const getHeaders = async () => {
  const session = await getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.tokens.accessToken}`,
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }
  const data = await response.json();
  if (!response.ok) {
    console.log("error=>", extractErrors(data.error));
    throw new Error(extractErrors(data.error));
  }
  return data;
};

export const get = async <T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> => {
  const headers = await getHeaders();
  const response = await fetch(`${API}${endpoint}`, {
    method: "GET",
    headers,
    ...options,
  });
  return handleResponse<T>(response);
};

export const post = async <T>(endpoint: string, data: unknown): Promise<T> => {
  const headers = await getHeaders();
  const response = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
};

export const auth = async <T>(endpoint: string, data: unknown): Promise<T> => {
  const response = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
};

export const put = async <T>(endpoint: string, data: unknown): Promise<T> => {
  const headers = await getHeaders();
  const response = await fetch(`${API}${endpoint}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
};

export const del = async <T>(endpoint: string, data?: object): Promise<T> => {
  const headers = await getHeaders();
  const options: RequestInit = {
    method: "DELETE",
    headers,
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(`${API}${endpoint}`, options);
  return handleResponse<T>(response);
};
