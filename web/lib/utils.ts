import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/*
 * cn function to merge class names
 * @param inputs class names to be merged
 * @returns merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
 * convert string to color
 * @param str string to be converted to color
 * @returns string of color in hex format
 */
export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

/*
 * convert hex color to rgba color
 * @param hex string of hex color
 * @param alpha number of alpha value
 * @returns string of rgba color
 */
export const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/*
 * generate random color
 * @returns string of random color in hex format
 */
export const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/*
 * extract errors from response
 * @param error error object from response
 * @returns string of errors
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractErrors = (error: any): string => {
  if (!error) return "An unknown error occurred.";

  if (typeof error === "string") {
    return error;
  }

  if (typeof error !== "object") {
    return "Unexpected error format.";
  }

  const messages: string[] = [];

  // Handle top-level _errors
  if (Array.isArray(error._errors)) {
    messages.push(...error._errors);
  }

  // Handle field-specific _errors
  for (const key in error) {
    if (key === "_errors") continue;

    const value = error[key];
    if (value?._errors && Array.isArray(value._errors)) {
      messages.push(...value._errors.map((msg: string) => `${key}: ${msg}`));
    }
  }

  return messages.length ? messages.join("\n") : "An unknown error occurred.";
};

/*
 * create slug from string
 * @param text string to be converted to slug
 * @returns slug string
 */
export const createSlug = (text: string) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

/*
<div className="p-2 border-t border-gray-200">
        {isAdding ? (
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Enter task description..."
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleAddTask}
                disabled={!newTaskContent.trim()}
              >
                Add
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewTaskContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            className="flex w-full justify-start text-gray-500 hover:text-gray-700" 
            onClick={() => setIsAdding(true)}
          >
            <PlusCircle className="mr-1" size={16} />
            <span>Add task</span>
          </Button>
        )}
      </div>
*/
