"use client";

import { loginAction, signupAction } from "@/actions/auth-actions";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

interface AuthContextType {
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (userData: Omit<User, "id">) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const queryClient = getQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await loginAction({ email, password });

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

  const signupMutation = useMutation({
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

  const login = async (data: { email: string; password: string }) => {
    await loginMutation.mutateAsync(data);
  };

  const signup = async (userData: Omit<User, "id">) => {
    await signupMutation.mutateAsync(userData);
  };

  return (
    <AuthContext.Provider value={{ login, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
