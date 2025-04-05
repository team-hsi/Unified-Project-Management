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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Item } from "./columns";

interface EditItemModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: Item) => void;
}

export function EditItemModal({
  item,
  isOpen,
  onClose,
  onSave,
}: EditItemModalProps) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  // const [label, setLabel] = useState<string | null>(item.labels[0] || null);
  // const [status, setStatus] = useState<
  //   "Todo" | "In-Progress" | "Done" | "Canceled"
  // >(item.status);
  // const [priority, setPriority] = useState<"Low" | "Medium" | "High">(
  //   item.priority
  // );
  const [startDate, setStartDate] = useState(item.startDate);
  const [dueDate, setDueDate] = useState(item.dueDate);

  const handleSave = async () => {
    try {
      const updatedItem: Item = {
        ...item,
        name,
        description,
        // labels: label ? [label] : [],
        // status,
        // priority,
        startDate,
        dueDate,
      };

      const response = await fetch(`/v1/items/{id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      onSave(result);
      onClose();
    } catch (error) {
      console.error("Failed to update item:", error);
      alert("Failed to update item. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Update Item
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the item details and save the changes
          </DialogDescription>
        </DialogHeader>
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
            />
          </div>
          {/* Label */}
          {/* <div className="grid gap-2">
            <label htmlFor="label" className="text-sm font-medium">
              Label
            </label>
            <Select
              value={label || undefined}
              onValueChange={(value) =>
                setLabel(
                  value as
                    | "Bug"
                    | "Feature"
                    | "Enhancement"
                    | "Documentation"
                    | null
                )
              }
            >
              <SelectTrigger
                id="label"
                className="bg-gray-950 border-gray-700 text-white"
              >
                <SelectValue placeholder="Select a label" />
              </SelectTrigger>
              <SelectContent className="bg-gray-950 border-gray-700 text-white">
                <SelectItem value="Bug">Bug</SelectItem>
                <SelectItem value="Feature">Feature</SelectItem>
                <SelectItem value="Enhancement">Enhancement</SelectItem>
                <SelectItem value="Documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          {/* Status */}
          {/* <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "Todo" | "In-Progress" | "Done" | "Canceled")
              }
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
          </div> */}
          {/* Priority */}
          {/* <div className="grid gap-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(value) =>
                setPriority(value as "Low" | "Medium" | "High")
              }
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
          </div> */}
          {/* Assigned To */}
          {/* <div className="grid gap-2">
            <label htmlFor="assignedTo" className="text-sm font-medium">
              Assigned To
            </label>
            <Input
              id="assignedTo"
              value={item.assignedTo}
              disabled
              className="bg-gray-950 border-gray-700 text-white placeholder-gray-500"
              placeholder="Assigned To"
            />
          </div> */}
          {/* Start Date */}
          <div className="grid gap-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </label>
            <Input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-950 border-gray-700 text-white placeholder-gray-500"
            />
          </div>
          {/* Due Date */}
          <div className="grid gap-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-gray-950 border-gray-700 text-white placeholder-gray-500"
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-white text-black hover:bg-gray-200"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
