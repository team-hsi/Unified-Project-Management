import { getDocumentById } from "@/actions/api/document/queries";
import Editor from "@/feature/documentation/editor";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
type Props = {
  params: Promise<{ docId: string; projectId: string }>;
  children: React.ReactNode;
};
const page = async (props: Props) => {
  const params = await props.params;
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: [params.projectId, "documents", params.docId],
    queryFn: () => getDocumentById({ id: params.docId }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Editor />
      </div>
    </HydrationBoundary>
  );
};

export default page;
