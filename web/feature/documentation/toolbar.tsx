import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";
import {
  $wrapNodes,
  $isAtNodeEnd,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Strikethrough,
  Subscript,
  Superscript,
  ListOrdered,
  IndentIncrease,
  IndentDecrease,
  TextQuote,
} from "lucide-react";
import { List as ListUnordered } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounceCallback } from "usehooks-ts";
import { useMutation } from "@tanstack/react-query";
import { updateDocument } from "@/actions/api/document/mutations";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useUtils } from "../shared/hooks/use-utils";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { emptyValue } from "./editor";

const ToolbarPlugin = () => {
  const queryClient = getQueryClient();
  const { isValidResponse, toastUnknownError } = useUtils();
  const { projectId, docId } = useParams<{
    projectId: string;
    docId: string;
  }>();
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [textAlignment, setTextAlignment] = useState("left");
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null
  );
  const [blockType, setBlockType] = useState("paragraph");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));

      const node = selection.anchor.getNode();
      const parent = node.getParent();

      // Text alignment
      const alignment = $getSelectionStyleValueForProperty(
        selection,
        "text-align",
        "left"
      );
      setTextAlignment(alignment);

      // Check block type
      if ($isHeadingNode(parent)) {
        const tag = parent.getTag();
        setBlockType(tag);
      } else if ($isListNode(parent)) {
        const parentList = $getNearestNodeOfType(node, ListNode);
        const listType = parentList ? parentList.getListType() : null;
        setBlockType(listType === "bullet" ? "bullet" : "number");
      } else if (parent) {
        setBlockType(parent.getType());
      }

      setSelectedElementKey(node.getKey());
    }
  }, [activeEditor]);

  // save to db
  const update = useMutation({
    mutationFn: updateDocument,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [projectId, "documents", docId],
      });
      toast.success("saved");
    },
    onError: toastUnknownError,
  });

  const handleSave = useDebounceCallback(async (state: string) => {
    console.log("state", state);
    await update.mutateAsync({
      id: docId,
      projectId: projectId,
      content: state || emptyValue,
    });
  }, 2000);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves }) => {
          editorState.read(() => {
            updateToolbar();
          });
          if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
            return;
          }
          handleSave(JSON.stringify(editorState));
        }
      )
    );
  }, [editor, updateToolbar]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createQuoteNode());
      }
    });
  };

  const getBlockTypeIcon = (
    type: "h1" | "h2" | "h3" | "bullet" | "number" | "quote" | "paragraph"
  ) => {
    switch (type) {
      case "h1":
      case "h2":
      case "h3":
        return <span className="font-bold">{type.toUpperCase()}</span>;
      case "bullet":
        return <ListUnordered size={18} />;
      case "number":
        return <ListOrdered size={18} />;
      case "quote":
        return <TextQuote size={18} />;
      default:
        return <span className="text-sm">Paragraph</span>;
    }
  };

  const renderBlockTypeSelect = () => (
    <div className="relative inline-block">
      <select
        className="appearance-none border rounded py-1 px-3 text-sm bg-white"
        onChange={(e) => {
          const type = e.target.value;
          switch (type) {
            case "paragraph":
              formatParagraph();
              break;
            case "h1":
            case "h2":
            case "h3":
              formatHeading(type);
              break;
            case "quote":
              formatQuote();
              break;
            default:
              formatParagraph();
          }
        }}
        value={blockType}
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="quote">Quote</option>
      </select>
    </div>
  );

  const renderToolbarButton = (
    icon: React.ReactNode,
    isActive: boolean,
    label: string,
    onClick: () => void
  ) => (
    <button
      className={cn(
        "p-1.5 rounded hover:bg-gray-100 transition-colors",
        isActive && "bg-gray-200"
      )}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );

  return (
    <div className="toolbar">
      <div className="toolbar-section">{renderBlockTypeSelect()}</div>
      <div className="toolbar-divider" />
      <div className="toolbar-section">
        {renderToolbarButton(<Bold size={18} />, isBold, "Bold", () => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        })}
        {renderToolbarButton(<Italic size={18} />, isItalic, "Italic", () => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        })}
        {renderToolbarButton(
          <Underline size={18} />,
          isUnderline,
          "Underline",
          () => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }
        )}
        {renderToolbarButton(
          <Strikethrough size={18} />,
          isStrikethrough,
          "Strikethrough",
          () => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          }
        )}
        {renderToolbarButton(
          <Superscript size={18} />,
          isSuperscript,
          "Superscript",
          () => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
          }
        )}
        {renderToolbarButton(
          <Subscript size={18} />,
          isSubscript,
          "Subscript",
          () => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
          }
        )}
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-section">
        {renderToolbarButton(
          <AlignLeft size={18} />,
          textAlignment === "left",
          "Align Left",
          () => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
          }
        )}
        {renderToolbarButton(
          <AlignCenter size={18} />,
          textAlignment === "center",
          "Align Center",
          () => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
          }
        )}
        {renderToolbarButton(
          <AlignRight size={18} />,
          textAlignment === "right",
          "Align Right",
          () => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
          }
        )}
        {renderToolbarButton(
          <AlignJustify size={18} />,
          textAlignment === "justify",
          "Justify",
          () => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
          }
        )}
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-section">
        {renderToolbarButton(
          <ListUnordered size={18} />,
          blockType === "bullet",
          "Bullet List",
          () => {
            if (blockType === "bullet") {
              activeEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            } else {
              activeEditor.dispatchCommand(
                INSERT_UNORDERED_LIST_COMMAND,
                undefined
              );
            }
          }
        )}
        {renderToolbarButton(
          <ListOrdered size={18} />,
          blockType === "number",
          "Numbered List",
          () => {
            if (blockType === "number") {
              activeEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            } else {
              activeEditor.dispatchCommand(
                INSERT_ORDERED_LIST_COMMAND,
                undefined
              );
            }
          }
        )}
        {renderToolbarButton(
          <IndentDecrease size={18} />,
          false,
          "Decrease Indent",
          () => {
            activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
          }
        )}
        {renderToolbarButton(
          <IndentIncrease size={18} />,
          false,
          "Increase Indent",
          () => {
            activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
          }
        )}
      </div>
      <div className="toolbar-divider" />
      <div className="toolbar-section">
        {renderToolbarButton(<Undo size={18} />, false, "Undo", () => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        })}
        {renderToolbarButton(<Redo size={18} />, false, "Redo", () => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        })}
      </div>
      {/* <button onClick={onSave}>{isLoading ? "saving" : "save"}</button> */}
    </div>
  );
};

export default ToolbarPlugin;
