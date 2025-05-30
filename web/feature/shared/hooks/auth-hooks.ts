"use client";
import { createUser, loginUser, logoutUser } from "@/actions/api/user/auth";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BaseError, isErrorResponse } from "@/lib/errors";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (isErrorResponse(response)) {
        toast.error(response.error.displayName, {
          description: response.error.message,
        });
        return;
      }
      if (response.activeSpace) {
        router.replace(`/${response.activeSpace?.id}/projects`);
      } else {
        router.replace(`/select-workspace`);
      }
      toast.success("Auth", {
        description: "Logged in successfully!",
      });
    },
    onError: (error: BaseError) => {
      toast.error(error.displayName, {
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
    onSuccess: (response) => {
      if (isErrorResponse(response)) {
        toast.error(response.error.displayName, {
          description: response.error.message,
        });
        return;
      }
      const user = response.data;
      queryClient.setQueryData(["user"], user);
      toast.success("Account created successfully!");
      if (user.activeSpace) {
        router.push(`/${user.activeSpace.id}/projects`);
      } else {
        router.push("/select-workspace");
      }
    },
    onError: (error: BaseError) => {
      toast.error(error.displayName, {
        description: error.message,
      });
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
    onError: (error: BaseError) => {
      toast.error(error.displayName, {
        description: error.message,
      });
    },
  });
};
