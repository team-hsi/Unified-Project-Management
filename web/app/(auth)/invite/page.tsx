import { getSpaceInviteInfo } from "@/actions/api/workspace/queries";
import Invitation from "@/feature/shared/components/invitation";
import React from "react";
// type Params = Promise<{ slug: string }>;
// type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    inviteId: string;
  }>;
}) => {
  const inviteId = (await searchParams)?.inviteId;
  if (!inviteId) {
    return <div>Invalid invite link</div>;
  }
  const spInv = await getSpaceInviteInfo(inviteId);
  console.log(spInv);
  return (
    <div>
      <Invitation inviteId={inviteId} invitation={spInv} />
    </div>
  );
};

export default page;
