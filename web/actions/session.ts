import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
export const COOKIE_NAME = "unifiedSession";

export type SessionPayload = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("59m")
    .sign(encodedKey);
}
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log("Failed to verify session");
  }
}
export async function createSession({
  userId,
  accessToken,
  refreshToken,
}: {
  userId: string;
  accessToken: string;
  refreshToken: string;
}) {
  const expiresAt = new Date(Date.now() + 59 * 60 * 1000);
  const session = await encrypt({
    userId,
    accessToken,
    refreshToken,
    expiresAt,
  });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 59 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
