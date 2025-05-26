import { getDocumentById } from "@/actions/api/document/queries";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Room } from "@/feature/documentation/components/room";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import React from "react";
type Props = {
  params: Promise<{ docId: string; projectId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { docId } = await params;

  const document = await getDocumentById({ id: docId });
  if (!document) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: document.name || docId,
  };
}
const page = async (props: Props) => {
  const params = await props.params;
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: [params.projectId, "documents", params.docId],
    queryFn: () => getDocumentById({ id: params.docId }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Room>
        {/* <Editor /> */}
        <SimpleEditor />
      </Room>
    </HydrationBoundary>
  );
};

export default page;
