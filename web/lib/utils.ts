import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

export default stringToColor;

export const stringToColorHsl = (str: string) => {
  // Simple hash function to convert string to a number
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to a hex color
  // Using HSL to ensure good saturation and lightness
  const h = Math.abs(hash) % 360;
  const s = 70 + (Math.abs(hash) % 30); // 70-100% saturation
  const l = 80; // 80% lightness for pastel colors that work well as backgrounds

  return `hsl(${h}, ${s}%, ${l}%)`;
};
