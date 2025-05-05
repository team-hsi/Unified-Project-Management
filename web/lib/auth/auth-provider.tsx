"use client";

import { User } from "@/feature/shared/@types/user";
import {
  getCurrentSession,
  getSessionUser,
} from "@/actions/auth-actions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createContext, useContext, ReactNode } from "react";

export interface Session {
  isAuth: boolean;
  activeSpace: unknown;
  userId: unknown;
  tokens: {
    accessToken: unknown;
    refreshToken: unknown;
  };
  expiresAt?: unknown;
}
interface AuthContextType {
  user: User | null;
  isPending: boolean;
  error: Error | null;
  session: Session | null;
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
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const { data: session } = useSuspenseQuery({
    queryKey: ["session"],
    queryFn: getCurrentSession,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return (
    <AuthContext.Provider
      value={{ user, isPending, error, session: session ?? null }}
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
