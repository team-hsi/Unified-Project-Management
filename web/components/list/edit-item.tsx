"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ItemSheet } from "../sheets/item-sheet";

// Utility function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export function EditItemUI({ item }: { item: Item }) {
  const [name, setName] = useState(item.name ?? "");
  const [description, setDescription] = useState(item.description ?? "");
  const [status, setStatus] = useState<
    "todo" | "in-progress" | "done" | "canceled"
  >(item.status);
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    item.priority
  );
  const [startDate, setStartDate] = useState(item.startDate ?? "");
  const [dueDate, setDueDate] = useState(item.dueDate ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (
      !name ||
      !description ||
      !status ||
      !priority ||
      !startDate ||
      !dueDate
    ) {
      setError("All fields are required.");
      return;
    }

    setError(null);
    setLoading(true);

    const formattedStartDate = formatDateToYYYYMMDD(startDate);
    const formattedDueDate = formatDateToYYYYMMDD(dueDate);

    try {
      console.log("Saving item with data:", {
        name,
        description,
        status,
        priority,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
      });
    } catch (err) {
      setError("Failed to save item. Please try again.");
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ItemSheet item={item}>
      <div className="w-full sm:max-w-lg bg-black text-white border-l border-gray-700 overflow-auto">
        <div className="text-lg font-semibold mb-2">Update Item</div>
        <p className="text-sm text-gray-400 mb-4">
          Update the item details and save the changes
        </p>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-950 border-gray-700 text-white placeholder-gray-500"
              placeholder="Enter item name"
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-950 border-gray-700 text-white placeholder-gray-500"
              placeholder="Enter item description"
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "todo" | "in-progress" | "done" | "canceled")
              }
              disabled={loading}
            >
              <SelectTrigger
                id="status"
                className="bg-gray-950 border-gray-700 text-white"
              >
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-950 border-gray-700 text-white">
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="In-Progress">In-Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>

            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(value) =>
                setPriority(value as "low" | "medium" | "high")
              }
              disabled={loading}
            >
              <SelectTrigger
                id="priority"
                className="bg-gray-950 border-gray-700 text-white"
              >
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
              <SelectContent className="bg-gray-950 border-gray-700 text-white">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-950 border-gray-700 text-white placeholder-gray-500"
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-gray-950 border-gray-700 text-white placeholder-gray-500"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => {}}
            className="bg-gray-800 border-gray-700 w-full text-white hover:bg-gray-700"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-white text-black w-full hover:bg-gray-200"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </ItemSheet>
  );
}
