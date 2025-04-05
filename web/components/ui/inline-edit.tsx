import { useState, useRef } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

const InlineEdit = ({
  text,
  textStyle,
  inputStyle,
  onSave,
}: {
  text: string;
  textStyle?: string;
  inputStyle?: string;
  onSave: (value: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef(null);

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() !== "" && value.length >= 3) onSave(value);
    else setValue(text); // Reset on bad input
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
