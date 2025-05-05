import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { COOKIE_NAME, decrypt } from "./session";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) {
    redirect("/sign-in");
  }
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/sign-in");
  }
  // TODO: check if session is expired and refresh it
  return {
    isAuth: true,
    activeSpace: session.activeSpace,
    userId: session.userId,
    tokens: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
    expiresAt: session.expiresAt,
  };
});

export const getSession = cache(async () => {
  const session = await verifySession();
  if (!session) return redirect("/sign-in");
  return session;
});

// export const getActiveWS = cache(async () => {
//   const cookie = (await cookies()).get(ACTIVE_WS)?.value;
//   if (!cookie) {
//     redirect("/select-workspace");
//   }
//   return cookie;
// });

// export const deleteActiveWS = async () => {
//   const cookieStore = await cookies();
//   cookieStore.delete(ACTIVE_WS);
// };

export const getUser = cache(async () => {
  const session = await getSession();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/users/getcurrentuser`,
      {
        headers: {
          Authorization: `Bearer ${session.tokens.accessToken}`,
        },
      }
    );

    const user = await res.json();

    return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});
