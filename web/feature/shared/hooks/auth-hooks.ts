"use client";
import {
  userCreate,
  userLogin,
  userLogout,
} from "@/feature/shared/actions/user-actions";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: userLogin,
    onSuccess: (user) => {
      console.log("onSuccess", user);
      const callbackUrl = searchParams.get("callbackUrl");
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (!user.activeSpace) {
        router.push("/select-workspace");
      } else {
        router.push(`/${user.activeSpace}/projects`);
      }
      queryClient.setQueryData(["user"], user);
      toast.success("Auth", {
        description: "Logged in successfully!",
      });
    },
    onError: (error: Error) => {
      if (error.message === "fetch failed") {
        toast.error("Auth", {
          description: "Network failure check your connection!",
        });
      } else {
        toast.error("Auth", {
          description: error.message,
        });
      }
    },
  });
}

export const useSignup = () => {
  const router = useRouter();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: async (userData: Omit<User, "id">) => {
      const result = await userCreate(userData);
      if (!result.success) {
        throw new Error(result.error || "Failed to create account");
      }

      return result.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      toast.success("Account created successfully!");
      router.push(`/${user.activeSpace.id}/projects`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useLogout = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
