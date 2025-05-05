"use client";
import { createUser, loginUser, logoutUser } from "@/actions/api/user/auth";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      if (!user.activeSpace) {
        router.push("/select-workspace");
      } else {
        router.push(`/${user.activeSpace.id}/projects`);
      }
      queryClient.setQueryData(["user"], user);
      toast.success("Auth", {
        description: "Logged in successfully!",
      });
    },
    onError: (error: Error) => {
      console.error("Login error =>:", error);
      toast.error("Auth", {
        description: error.message,
      });
    },
  });
}

export const useSignup = () => {
  const router = useRouter();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      toast.success("Account created successfully!");
      if (user.activeSpace) {
        router.push(`/${user.activeSpace.id}/projects`);
      } else {
        router.push("/select-workspace");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useLogout = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
