"use client";

import * as React from "react";
import { EditorContext } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/feature/shared/ui/popover";
import { Separator } from "@/feature/shared/ui/separator";
import { Textarea } from "@/feature/shared/ui/textarea";
import { processTextWithAI } from "@/actions/api/document/ai-actions";
import {
  Sparkles,
  AlertTriangle,
  Wand2,
  AlignLeft,
  FileText,
  Briefcase,
  Coffee,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { handleError } from "@/lib/errors";

export function AIButton() {
  // Use the EditorContext from TipTap
  const { editor } = React.useContext(EditorContext);
  const [, setCurrentAction] = React.useState<string | null>(null);
  const [originalSelection, setOriginalSelection] = React.useState<{
    from: number;
    to: number;
  } | null>(null);
  const [showResponseArea, setShowResponseArea] = React.useState(false);
  const [selectedText, setSelectedText] = React.useState<string>("");
  const [originalHtml, setOriginalHtml] = React.useState<string>("");
  const [editableResponse, setEditableResponse] = React.useState<string>("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const processWithAI = async (action: string) => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const plainText = editor.state.doc.textBetween(from, to, " ");

    if (!plainText) {
      toast.info("No text selected", {
        description: "Please select some text first",
      });
      return;
    }

    // Store the original selection and text
    setOriginalSelection({ from, to });
    setSelectedText(plainText);

    // Get the HTML of the selected content
    const selectedHTML = getSelectedHTML(editor, from, to);

    // Show the response area immediately
    setCurrentAction(action);
    setShowResponseArea(true);
    setEditableResponse("");
    setIsProcessing(true);

    try {
      // Create FormData properly
      const formData = new FormData();
      formData.append("action", action);
      formData.append("text", plainText);
      formData.append("html", selectedHTML);

      // Call the server action directly
      const result = await processTextWithAI(null, formData);

      // Handle the response
      if (result.success && result.result) {
        const displayText = convertHtmlToText(result.result);
        setEditableResponse(displayText);
        setOriginalHtml(result.result);
      } else {
        toast.error("Error", {
          description: result.error || "Failed to process with AI",
        });
        resetAIState();
      }
    } catch (error) {
      console.error("AI processing error:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to process with AI",
      });
      resetAIState();
    } finally {
      setIsProcessing(false);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSelectedHTML = (editor: any, from: number, to: number) => {
    try {
      const plainText = editor.state.doc.textBetween(from, to, " ");
      let html = plainText;

      // Get marks from the selection
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const marks: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editor.state.doc.nodesBetween(from, to, (node: any) => {
        if (node.marks) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          node.marks.forEach((mark: any) => {
            if (!marks.find((m) => m.type.name === mark.type.name)) {
              marks.push(mark);
            }
          });
        }
      });

      // Apply formatting
      marks.forEach((mark) => {
        switch (mark.type.name) {
          case "bold":
          case "strong":
            html = `<strong>${html}</strong>`;
            break;
          case "italic":
          case "em":
            html = `<em>${html}</em>`;
            break;
          case "underline":
            html = `<u>${html}</u>`;
            break;
          case "link":
            const href = mark.attrs?.href || "#";
            html = `<a href="${href}">${html}</a>`;
            break;
        }
      });

      // Check for block-level formatting
      const $from = editor.state.doc.resolve(from);
      const parentNode = $from.parent;

      if (parentNode) {
        switch (parentNode.type.name) {
          case "heading":
            const level = parentNode.attrs?.level || 1;
            html = `<h${level}>${html}</h${level}>`;
            break;
          case "blockquote":
            html = `<blockquote>${html}</blockquote>`;
            break;
          case "listItem":
            html = `<li>${html}</li>`;
            break;
          default:
            html = `<p>${html}</p>`;
            break;
        }
      } else {
        html = `<p>${html}</p>`;
      }

      return html;
    } catch (error) {
      console.error("Error getting selected HTML:", error);
      const plainText = editor.state.doc.textBetween(from, to, " ");
      return `<p>${plainText}</p>`;
    }
  };

  const convertHtmlToText = (html: string) => {
    try {
      if (!html.includes("<") || !html.includes(">")) {
        return html;
      }
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || html;
    } catch (error) {
      handleError(error);
      return html;
    }
  };

  const resetAIState = () => {
    setEditableResponse("");
    setOriginalHtml("");
    setOriginalSelection(null);
    setCurrentAction(null);
    setShowResponseArea(false);
    setSelectedText("");
  };

  const acceptResponse = () => {
    if (!editor || !originalSelection) return;

    try {
      // Use the edited response or fall back to original HTML
      const contentToInsert = originalHtml || editableResponse;

      // Insert the content
      if (contentToInsert.includes("<") && contentToInsert.includes(">")) {
        try {
          editor
            .chain()
            .focus()
            .setTextSelection(originalSelection)
            .deleteSelection()
            .insertContent(contentToInsert)
            .run();
        } catch (htmlError) {
          handleError(htmlError);
          // Fallback to plain text
          const plainText = convertHtmlToText(contentToInsert);
          editor
            .chain()
            .focus()
            .setTextSelection(originalSelection)
            .deleteSelection()
            .insertContent(plainText)
            .run();
        }
      } else {
        // Insert as plain text
        editor
          .chain()
          .focus()
          .setTextSelection(originalSelection)
          .deleteSelection()
          .insertContent(editableResponse)
          .run();
      }

      resetAIState();

      toast.success("Success!", {
        description: "AI response applied successfully",
      });
    } catch (error) {
      console.error("Error applying AI response:", error);

      // Ultimate fallback - just insert plain text
      try {
        const plainText = editableResponse || convertHtmlToText(originalHtml);
        editor.commands.insertContentAt(originalSelection.from, plainText);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }

      resetAIState();

      toast.info("Applied with basic formatting", {
        description: "Text updated but some formatting may be lost",
      });
    }
  };

  const rejectResponse = () => {
    resetAIState();
    toast.info("Response rejected", {
      description: "Original text remains unchanged",
    });
  };

  if (!editor) {
    return null;
  }

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          resetAIState();
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100"
          disabled={isProcessing}
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3 space-y-3">
          {showResponseArea && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {isProcessing ? "Processing..." : "AI Response Preview"}
              </label>

              {isProcessing ? (
                <div className="flex items-center justify-center p-4 border rounded-md bg-muted/50">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Generating response...
                  </span>
                </div>
              ) : (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    Original: {selectedText}
                  </div>
                  <Textarea
                    value={editableResponse}
                    onChange={(e) => setEditableResponse(e.target.value)}
                    className="min-h-[80px] text-sm"
                    placeholder="AI response will appear here..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={acceptResponse}
                      className="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </button>
                    <button
                      onClick={rejectResponse}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </div>
                </>
              )}
              <Separator />
            </div>
          )}

          {!showResponseArea && (
            <div className="space-y-1">
              <p className="text-sm font-medium px-1 py-1 text-muted-foreground">
                Modify selection
              </p>

              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                onClick={() => processWithAI("fix")}
                disabled={isProcessing}
              >
                <AlertTriangle className="h-4 w-4 mr-3 text-blue-500" />
                <span>Fix typos</span>
              </button>

              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                onClick={() => processWithAI("improve")}
                disabled={isProcessing}
              >
                <Wand2 className="h-4 w-4 mr-3 text-blue-500" />
                <span>Improve writing</span>
              </button>

              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                onClick={() => processWithAI("simplify")}
                disabled={isProcessing}
              >
                <AlignLeft className="h-4 w-4 mr-3 text-blue-500" />
                <span>Simplify</span>
              </button>

              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                onClick={() => processWithAI("detail")}
                disabled={isProcessing}
              >
                <AlignLeft className="h-4 w-4 mr-3 text-blue-500" />
                <span>Add more detail</span>
              </button>

              <Separator className="my-1" />

              <p className="text-sm font-medium px-1 py-1 text-muted-foreground">
                Generate
              </p>

              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                onClick={() => processWithAI("summarize")}
                disabled={isProcessing}
              >
                <FileText className="h-4 w-4 mr-3 text-blue-500" />
                <span>Summarize</span>
              </button>

              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                onClick={() => processWithAI("professional")}
                disabled={isProcessing}
              >
                <Briefcase className="h-4 w-4 mr-3 text-blue-500" />
                <span>Make professional</span>
              </button>

              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                onClick={() => processWithAI("casual")}
                disabled={isProcessing}
              >
                <Coffee className="h-4 w-4 mr-3 text-blue-500" />
                <span>Make casual</span>
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
