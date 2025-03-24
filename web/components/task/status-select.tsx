"use client";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { statusOptions } from "./temp-data";
import { Dot } from "./dot";
import { Badge } from "../ui/badge";
import { StatusOption } from "./types";

interface StatusSelectProps {
  value: string;
  className?: string;
  size?: "default" | "icon" | "sm" | "lg";
}

export function StatusSelect({ value, className }: StatusSelectProps) {
  const groupedOptions = statusOptions.reduce((acc, option) => {
    const group = option.group || "Other";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, StatusOption[]>);

  const selectedOption =
    statusOptions.find((option) => option.value === value) || statusOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className={cn(
            "rounded-full cursor-pointer",
            selectedOption.color,
            className
          )}
        >
          <Dot size="sm" className={selectedOption.dotColor} />
          <span className="text-xs font-normal">{selectedOption.label}</span>
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0" align="start">
        <div className="pt-2 flex-col gap-2 flex">
          {Object.entries(groupedOptions).map(
            ([group, options], index, array) => (
              <div key={group}>
                <DropdownMenuLabel className="text-sm ">
                  {group}
                </DropdownMenuLabel>
                <DropdownMenuGroup className="space-y-1 px-3">
                  {options.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      // onClick={}
                    >
                      <Badge
                        variant="secondary"
                        className={cn("rounded-full", option.color, className)}
                      >
                        <Dot size="sm" className={option.dotColor} />
                        <span className="text-xs font-normal">
                          {option.label}
                        </span>
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                {index < array.length - 1 && <DropdownMenuSeparator />}
              </div>
            )
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
