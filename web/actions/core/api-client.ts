"use server";
import { getSession } from "./dal";
import {
  AuthenticationError,
  APIError,
  NotFoundError,
  BadRequestError,
  AuthorizationError,
} from "@/lib/errors";

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
    if (response.status === 400) {
      throw new BadRequestError(data.error);
    }
    if (response.status === 401) {
      throw new AuthenticationError(data.error);
    }
    if (response.status === 403) {
      throw new AuthorizationError(data.error);
    }
    if (response.status === 404) {
      throw new NotFoundError(data.error);
    }
    throw new APIError(data.error || "Something went wrong", {
      code: data.error?.code || "API_ERROR",
      status: response.status,
      displayName: response.statusText,
    });
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
