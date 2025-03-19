"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Tag,
  Users,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  name: string;
  description: string;
  estimation: string;
  type: string;
  people: string[];
  priority: string;
}

interface TaskSection {
  title: string;
  tasks: Task[];
}

const initialTasks: TaskSection[] = [
  // ... (keeping your initialTasks data the same)
];

// ... (keeping your interfaces the same)

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskSection[]>(initialTasks);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({
    "To-do": true,
    "In Progress": true,
    "In Review": true,
  });
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceSectionIndex = tasks.findIndex(
      (section) => section.title === source.droppableId
    );
    const destSectionIndex = tasks.findIndex(
      (section) => section.title === destination.droppableId
    );

    // Create deep copy of tasks
    const newTasks = tasks.map((section) => ({
      ...section,
      tasks: [...section.tasks],
    }));

    // Remove task from source and add to destination
    const [movedTask] = newTasks[sourceSectionIndex].tasks.splice(
      source.index,
      1
    );
    newTasks[destSectionIndex].tasks.splice(destination.index, 0, movedTask);

    setTasks(newTasks);
  };

  const handleSelectAll = (section: TaskSection) => {
    if (selectedTasks.length === section.tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(section.tasks.map((task) => task.id));
    }
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleAction = (action: string, taskId: string) => {
    console.log(`${action} task ${taskId}`);
    // Implement your edit/view/delete logic here
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {tasks.map((section) => (
        <Collapsible
          key={section.title}
          open={isOpen[section.title]}
          onOpenChange={() =>
            setIsOpen({ ...isOpen, [section.title]: !isOpen[section.title] })
          }
          className="mb-4"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              {section.title} ({section.tasks.length})
              {isOpen[section.title] ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Droppable droppableId={section.title}>
              {(provided) => (
                <table
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full border-collapse"
                >
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="flex border p-2 justify-center items-center text-gray-600 text-xs">
                        <Checkbox
                          checked={
                            selectedTasks.length === section.tasks.length &&
                            section.tasks.length > 0
                          }
                          className="border border-gray-400"
                          onCheckedChange={() => handleSelectAll(section)}
                        />
                      </th>
                      <th className="border p-2 text-gray-600 text-xs">
                        <FileText className="inline-block mr-1" size={18} />
                        Task Name
                      </th>
                      <th className="border p-2 text-gray-600 text-xs">
                        <FileText className="inline-block mr-1" size={18} />
                        Description
                      </th>
                      <th className="border p-2 text-gray-600 text-xs">
                        <Calendar className="inline-block mr-1" size={18} />
                        Estimation
                      </th>
                      <th className="border p-2 text-gray-600 text-xs">
                        <Tag className="inline-block mr-1" size={18} />
                        Type
                      </th>
                      <th className="border p-2 text-gray-600 text-xs">
                        <Users className="inline-block mr-1" size={18} />
                        People
                      </th>
                      <th className="border p-2 text-gray-600 text-xs">
                        <AlertCircle className="inline-block mr-1" size={18} />
                        Priority
                      </th>
                      <th className="border p-2 text-gray-600 text-xs">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border"
                          >
                            <td className="border p-2">
                              <Checkbox
                                id={task.id}
                                checked={selectedTasks.includes(task.id)}
                                onCheckedChange={() =>
                                  handleTaskSelect(task.id)
                                }
                              />
                            </td>
                            <td className="border p-2">{task.name}</td>
                            <td className="border p-2">{task.description}</td>
                            <td className="border p-2">{task.estimation}</td>
                            <td className="border p-2">{task.type}</td>
                            <td className="border p-2 flex gap-1">
                              {task.people.map((person) => (
                                <Avatar key={person} className="text-white">
                                  <AvatarFallback className="bg-blue-400">
                                    {person}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </td>
                            <td className="border p-2">{task.priority}</td>
                            <td className="border p-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical size={18} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction("edit", task.id)
                                    }
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction("view", task.id)
                                    }
                                  >
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAction("delete", task.id)
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </DragDropContext>
  );
};

export default TaskList;
