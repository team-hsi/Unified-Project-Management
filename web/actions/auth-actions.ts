import { User } from "@/hooks/auth-hooks";
const API = process.env.NEXT_PUBLIC_API_URL;

export const signupAction = async (userData: Omit<User, "id">) => {
  const res = await fetch(`${API}/v1/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    return { success: false, error: error.error };
  }

  const user = await res.json();
  return { success: true, user };
};

export const loginAction = async (email: string, password: string) => {
  const res = await fetch(`${API}/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    return { success: false, error: error.error };
  }

  const user = await res.json();
  return { success: true, user };
};
