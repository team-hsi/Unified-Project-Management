"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter, Check } from "lucide-react"; // Added Check icon
import { cn } from "@/lib/utils"; // Utility for conditionally joining class names

const ProjectFilters = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    replace(`${pathname}?${params.toString()}`);
    setOpen(false); // Close the popover after selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 sm:h-10">
          <Filter className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-4">
          {/* Priority Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Priority</h4>
            <div className="mt-2 flex flex-col space-y-1">
              {["all", "low", "medium", "high"].map((priority) => {
                const isSelected = searchParams.get("priority") === priority || (priority === "all" && !searchParams.get("priority"));
                return (
                  <button
                    key={priority}
                    onClick={() => handleFilterChange("priority", priority)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md text-left transition flex items-center justify-between",
                      isSelected
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <span>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                    {isSelected && <Check className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Type</h4>
            <div className="mt-2 flex flex-col space-y-1">
              {["all", "development", "design", "marketing"].map((type) => {
                const isSelected = searchParams.get("type") === type || (type === "all" && !searchParams.get("type"));
                return (
                  <button
                    key={type}
                    onClick={() => handleFilterChange("type", type)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md text-left transition flex items-center justify-between",
                      isSelected
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    {isSelected && <Check className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProjectFilters;