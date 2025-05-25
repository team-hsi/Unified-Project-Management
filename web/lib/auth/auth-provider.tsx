"use client";

import { Session, User, UserPayload } from "@/feature/shared/@types/user";
import { getCurrentSession, getSessionUser } from "@/actions/api/user/auth";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createContext, useContext, ReactNode } from "react";
import { updateUser } from "@/actions/api/user/mutations";

interface AuthContextType {
  user: User | null;
  isPending: boolean;
  error: Error | null;
  session: Session | null;
  update: (user: Partial<Omit<UserPayload, "id" | "password">>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    isPending,
    error,
  } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: getSessionUser,
    staleTime: 1000 * 60 * 40,
  });

  const update = useMutation({
    mutationFn: updateUser,
    mutationKey: ["user"],
  });

  const { data: session } = useSuspenseQuery({
    queryKey: ["session"],
    queryFn: getCurrentSession,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isPending,
        error,
        update: update.mutateAsync,
        session: session ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
