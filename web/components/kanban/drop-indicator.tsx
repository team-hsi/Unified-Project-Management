import { Edge } from "./types";

export const DropIndicator = ({ edge }: { edge: Edge }) => {
  return (
    <div
      className={`absolute left-0 right-0 flex items-center ${
        edge === "top" ? "-top-3" : "-bottom-3"
      }`}
    >
      <div className="h-[10px] w-[10px] rounded-full border-2 border-blue-600"></div>
      <div className="h-[2px] flex-1 bg-blue-600"></div>
    </div>
  );
};
