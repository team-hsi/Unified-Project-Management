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
import { Task } from "./columns";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [label, setLabel] = useState<
    "Bug" | "Feature" | "Enhancement" | "Documentation" | null
  >(null); // Default to null since task.label isn't defined
  const [status, setStatus] = useState<
    "Todo" | "In-Progress" | "Done" | "Canceled"
  >(task.status);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(
    task.priority
  );
  const [estimatedHours, setEstimatedHours] = useState<string>("");

  const handleSave = () => {
    const updatedTask: Task = {
      ...task,
      title,
      status,
      priority,
      // Note: label isn't part of Task type; we'll add it in columns.tsx
    };
    onSave(updatedTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Update task
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the task details and save the changes
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-950 border-gray-700 text-white placeholder-gray-500"
              placeholder="Enter task title"
            />
          </div>
          {/* Label */}
          <div className="grid gap-2">
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
          {/* Assigned To */}
          <div className="grid gap-2">
            <label htmlFor="assignedTo" className="text-sm font-medium">
              Assigned To
            </label>
            <Input
              id="assignedTo"
              value={task.assignedTo}
              disabled
              className="bg-gray-950 border-gray-700 text-white placeholder-gray-500"
              placeholder="Assigned To"
            />
          </div>
          {/* Estimated Hours */}
          <div className="grid gap-2">
            <label htmlFor="estimatedHours" className="text-sm font-medium">
              Estimated Hours
            </label>
            <Input
              id="estimatedHours"
              type="number"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              className="bg-gray-950 border-gray-700 text-white placeholder-gray-500"
              placeholder="Enter estimated hours"
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="flex flex-col  gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-800 w-full  border-gray-700 text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-white w-full text-black hover:bg-gray-200"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
