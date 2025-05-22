"use client";
// import { useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDocumentById } from "@/actions/api/document/queries";
import { useParams } from "next/navigation";
import exampleTheme from "./themes/ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
export const emptyValue =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

function Placeholder() {
  return (
    <div className="editor-placeholder">
      Start typing or use formatting options from the toolbar...
    </div>
  );
}

function onError(error: Error) {
  console.error("doc on error => ", error);
}

const Editor = () => {
  // const [editorState, setEditorState] = useState<string | null>(null);
  const { projectId, docId } = useParams<{
    projectId: string;
    docId: string;
  }>();
  const {
    data: document,
    isPending,
    error,
  } = useSuspenseQuery({
    queryKey: [projectId, "documents", docId],
    queryFn: () => getDocumentById({ id: docId }),
  });

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

  const initialConfig = {
    namespace: "MyRichTextEditor",
    theme: exampleTheme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    editorState: document.content || emptyValue,
  };

  // const onChange = (state: EditorState) => {
  //   state.read(() => {
  //     const json = JSON.stringify(state.toJSON());
  //     setEditorState(json);
  //   });
  // };
  // const onSave = async () => {
  //   await update.mutateAsync({
  //     id: document.id,
  //     projectId: document.projectId,
  //     content: editorState || "",
  //   });
  // };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ErrorBoundary={LexicalErrorBoundary as any}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <ListPlugin />
          <LinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          {/* <OnChangePlugin onChange={onChange} /> */}
        </div>
      </div>
    </LexicalComposer>
  );
};

export default Editor;
