"use client";

import * as React from "react";
import {
  EditorContent,
  EditorContext,
  BubbleMenu,
  useEditor,
} from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";

import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import { MarkButton } from "@/components/tiptap-ui/mark-button";
// --- Hooks ---
import { useMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

import { MainToolbarContent, MobileToolbarContent } from "./toolbar";
import { AIButton } from "@/components/tiptap-ui/ai-popover/ai-popover";
import { useParams } from "next/navigation";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getDocumentById } from "@/actions/api/document/queries";
import { updateDocument } from "@/actions/api/document/mutations";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useUtils } from "@/feature/shared/hooks/use-utils";
// import { toast } from "sonner";
import { docPlaceholderContent } from "@/feature/documentation/overlays/new-doc";
import { useDebouncedCallback } from "use-debounce";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";

export function SimpleEditor() {
  // --- Hooks and State (must be called unconditionally) ---

  const liveblocks = useLiveblocksExtension();
  const isMobile = useMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const { projectId, docId } = useParams<{
    projectId: string;
    docId: string;
  }>();
  const queryClient = getQueryClient();
  const { isValidResponse, toastUnknownError } = useUtils();
  const {
    // Query hook
    data: document,
    isPending,
    error,
  } = useSuspenseQuery({
    queryKey: [projectId, "documents", docId],
    queryFn: () => getDocumentById({ id: docId }),
  });

  const update = useMutation({
    // Mutation hook
    mutationFn: updateDocument,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [projectId, "documents", docId],
      });
    },
    onError: toastUnknownError,
  });

  const handleSave = useDebouncedCallback(async (state: string) => {
    // Debounced callback hook
    await update.mutateAsync({
      id: docId,
      projectId: projectId,
      content: state || JSON.stringify(docPlaceholderContent),
    });
  }, 2000);

  const editor = useEditor({
    // Tiptap editor hook
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions: [
      liveblocks.configure({
        cursor: {
          render: (cursor: { userId: string; user?: { name: string } }) => {
            return cursor.user?.name || cursor.userId;
          },
        },
      }),
      StarterKit.configure({
        // The Liveblocks extension comes with its own history handling
        history: false,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,

      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    content: document?.content
      ? JSON.parse(document.content)
      : docPlaceholderContent,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      handleSave(JSON.stringify(json));
    },
  });

  const bodyRect = useCursorVisibility({
    // Custom hook
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    // Effect hook
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  // --- Conditional Renders (after hooks) ---
  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading editor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading document: {error.message}
      </div>
    );
  }

  // --- Main Render (hooks called above) ---
  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar
        ref={toolbarRef}
        style={
          isMobile
            ? {
                bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`,
              }
            : {}
        }
      >
        {mobileView === "main" ? (
          <MainToolbarContent
            onHighlighterClick={() => setMobileView("highlighter")}
            onLinkClick={() => setMobileView("link")}
            isMobile={isMobile}
          />
        ) : (
          <MobileToolbarContent
            type={mobileView === "highlighter" ? "highlighter" : "link"}
            onBack={() => setMobileView("main")}
          />
        )}
      </Toolbar>

      <div className="content-wrapper overflow-y-scroll">
        {editor && (
          <BubbleMenu
            className="flex p-1 gap-3 bg-background shadow-md"
            tippyOptions={{ duration: 100 }}
            editor={editor}
          >
            <MarkButton type="bold" />
            <MarkButton type="italic" />
            <MarkButton type="strike" />
            <MarkButton type="code" />
            <MarkButton type="underline" />
            <AIButton />
          </BubbleMenu>
        )}
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
        {/* <Threads editor={editor} /> */}
        {/* <FloatingToolbar editor={editor} /> */}
      </div>
    </EditorContext.Provider>
  );
}
