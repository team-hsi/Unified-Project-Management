"use client";

import { loginAction, signupAction } from "@/actions/auth-actions";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await loginAction(email, password);

      if (!result.success) {
        throw new Error(result.error || "Failed to login");
      }

      return result.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      toast.success("Logged in successfully!");
      router.push("/projects");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export const useSignup = () => {
  const router = useRouter();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async (userData: Omit<User, "id">) => {
      const result = await signupAction(userData);
      if (!result.success) {
        throw new Error(result.error || "Failed to create account");
      }

      return result.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      toast.success("Account created successfully!");
      router.push("/projects");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
