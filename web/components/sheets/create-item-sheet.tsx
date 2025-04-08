import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Item } from "../kanban/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateItemSheetProps {
  children: React.ReactNode;
  onCreate: (newItem: Item) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const CreateItemSheet = ({
  children,
  onCreate,
  isOpen,
  setIsOpen,
}: CreateItemSheetProps) => {
  const [formData, setFormData] = React.useState<Item>({
    id: "",
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    priority: "low",
    status: "todo",
    labels: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    setIsOpen(false);
    // Reset form after submission
    setFormData({
      id: "",
      name: "",
      description: "",
      startDate: null,
      dueDate: null,
      priority: "low",
      status: "todo",
      labels: [],
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="rounded-xl max-w-lg md:max-w-xl lg:max-w-2xl"
        hideClose
      >
        <SheetTitle className="sr-only">Create new item side sheet</SheetTitle>
        <div style={{ padding: "24px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            Create New Item
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                htmlFor="name"
                style={{ display: "block", marginBottom: "4px" }}
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter item name"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                style={{ display: "block", marginBottom: "4px" }}
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter item description"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  minHeight: "80px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  htmlFor="startDate"
                  style={{ display: "block", marginBottom: "4px" }}
                >
                  Start Date
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData?.startDate || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="dueDate"
                  style={{ display: "block", marginBottom: "4px" }}
                >
                  Due Date
                </label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData?.dueDate || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="priority"
                style={{ display: "block", marginBottom: "4px" }}
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData?.priority || "low"}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                style={{ display: "block", marginBottom: "4px" }}
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                type="submit"
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Create Item
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
