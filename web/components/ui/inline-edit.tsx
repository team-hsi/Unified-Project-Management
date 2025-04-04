import { useState, useRef } from "react";
import { Input } from "./input";
import { useMutation } from "@tanstack/react-query";
import { updateBucket } from "@/actions/bucket-actions";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { PartialProject } from "../project/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const InlineEdit = ({
  text,
  textStyle,
  inputStyle,
  args,
  queryKey,
}: {
  text: string;
  textStyle?: string;
  inputStyle?: string;
  args?: PartialProject;
  queryKey?: string[];
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef(null);
  const queryClient = getQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: updateBucket,
    onSuccess: () => {
      toast.success("Bucket name updated");
      queryClient.invalidateQueries({ queryKey });
    },
  });
  const onSave = (name: string) => {
    mutateAsync({ name, ...args });
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() !== "") onSave(value);
    else setValue(text);
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") handleBlur();
    if (e.key === "Escape") {
      setValue(text);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        "p-0 h-auto focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none outline-none bg-transparent",
        inputStyle
      )}
      autoFocus
    />
  ) : (
    <span
      onClick={() => setIsEditing(true)}
      className={` hover:bg-transparent ${textStyle}`}
    >
      {text || "Click to edit"}
    </span>
  );
};

export default InlineEdit;
