import { getUser } from "@/actions/api/user/queries";
// import { verifySession } from "@/actions/core/dal";
import liveblocks from "@/lib/liveblockes";
import { stringToColor } from "@/lib/utils";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  // const session = await verifySession();
  const user = await getUser();
  const { room } = await req.json();

  const session = liveblocks.prepareSession(user.id as string, {
    userInfo: {
      email: user.email,
      name: `${user.firstname} ${user.lastname}` as string,
      color: stringToColor(user.username) as string,
      avatar: `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`,
    },
  });

  // const userInRooms = await adminDb
  //   .collectionGroup("rooms")
  //   .where("userId", "==", sessionClaims?.email)
  //   .get();

  // const userInRoom = userInRooms.docs.find((doc) => doc.id === room);
  // if (userInRoom?.exists) {
  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();
  console.log("you are allowed to access this room");
  return new Response(body, { status });
  // } else {
  //   return NextResponse.json(
  //     { message: "You are not allowed to access this room" },
  //     { status: 403 }
  //   );
  // }
};
