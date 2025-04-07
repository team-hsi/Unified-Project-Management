"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Item } from "./columns";

interface EditItemModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: Item) => Promise<void>; // Updated to return a Promise
}

// Utility function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD
};

export function EditItemModal({
  item,
  isOpen,
  onClose,
  onSave,
}: EditItemModalProps) {
  const [name, setName] = useState(item.name ?? "");
  const [description, setDescription] = useState(item.description ?? "");
  const [status, setStatus] = useState<
    "Todo" | "In-Progress" | "Done" | "Canceled"
  >(item.status);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(
    item.priority
  );
  const [startDate, setStartDate] = useState(item.startDate ?? "");
  const [dueDate, setDueDate] = useState(item.dueDate ?? "");
  const [loading, setLoading] = useState(false); // New loading state
  const [error, setError] = useState<string | null>(null); // Optional: for error feedback

  const handleSave = async () => {
    // Validate all required fields
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

    setError(null); // Clear any previous error
    setLoading(true); // Activate loading state

    const formattedStartDate = formatDateToYYYYMMDD(startDate);
    const formattedDueDate = formatDateToYYYYMMDD(dueDate);

    const updatedItem: Item = {
      ...item,
      name,
      description,
      status,
      priority,
      startDate: formattedStartDate,
      dueDate: formattedDueDate,
    };

    try {
      await onSave(updatedItem); // Wait for the save operation to complete
      onClose(); // Close only on success
    } catch (err) {
      setError("Failed to save item. Please try again."); // Optional: error handling
      console.error("Save error:", err);
    } finally {
      setLoading(false); // Deactivate loading state regardless of success/failure
    }
  };

  const handleClose = () => {
    setName(item.name ?? "");
    setDescription(item.description ?? "");
    setStatus(item.status);
    setPriority(item.priority);
    setStartDate(item.startDate ?? "");
    setDueDate(item.dueDate ?? "");
    setError(null); // Clear error on close
    setLoading(false); // Reset loading state
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Update Item
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the item details and save the changes
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="grid gap-4 py-4">
          {/* Name */}
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
          {/* Description */}
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
          {/* Status */}
          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "Todo" | "In-Progress" | "Done" | "Canceled")
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
          </div>
          {/* Priority */}
          <div className="grid gap-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(value) =>
                setPriority(value as "Low" | "Medium" | "High")
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
          {/* Start Date */}
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
          {/* Due Date */}
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
        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
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
      </DialogContent>
    </Dialog>
  );
}
