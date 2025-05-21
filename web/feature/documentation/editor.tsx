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
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { EditorThemeClasses } from "lexical";
import ToolbarPlugin from "./toolbar";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import "./styles.css";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDocumentById } from "@/actions/api/document/queries";
import { useParams } from "next/navigation";

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
    theme: EditorTheme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
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
    <div className="editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-inner">
          <ToolbarPlugin />
          <div className="editor-content-container">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-content" />}
              placeholder={<Placeholder />}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ErrorBoundary={LexicalErrorBoundary as any}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            {/* <OnChangePlugin onChange={onChange} /> */}
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
};

export default Editor;

export const EditorTheme: EditorThemeClasses = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    subscript: "editor-text-subscript",
    superscript: "editor-text-superscript",
    code: "editor-text-code",
    highlight: "editor-text-highlight",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};
