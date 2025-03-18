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
import { ChevronDown, ChevronUp, List } from "lucide-react";

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
  {
    title: "To-do",
    tasks: [
      {
        id: "1",
        name: "Employee Details",
        description: "Create a page where there is information about employees",
        estimation: "Feb 14, 2024 - Feb 1, 2024",
        type: "Dashboard",
        people: ["AI", "BT"],
        priority: "Medium",
      },
      {
        id: "2",
        name: "Darkmode version",
        description: "Darkmode version for all screens",
        estimation: "Feb 14, 2024 - Feb 1, 2024",
        type: "Mobile App",
        people: ["AI", "BT"],
        priority: "Low",
      },
      {
        id: "3",
        name: "Super Admin Role",
        description: "-",
        estimation: "Feb 14, 2024 - Feb 1, 2024",
        type: "Dashboard",
        people: ["AI", "BT"],
        priority: "Medium",
      },
    ],
  },
  {
    title: "In Progress",
    tasks: [
      {
        id: "4",
        name: "Super Admin Role",
        description: "-",
        estimation: "Feb 14, 2024 - Feb 1, 2024",
        type: "Dashboard",
        people: ["DT"],
        priority: "High",
      },
      {
        id: "5",
        name: "Settings Page",
        description: "-",
        estimation: "Feb 14, 2024 - Feb 1, 2024",
        type: "Mobile App",
        people: ["DT"],
        priority: "Medium",
      },
      {
        id: "6",
        name: "KPI and Employee Statistics",
        description:
          "Create a design that displays KPIs and employee statistics",
        estimation: "Feb 14, 2024 - Feb 1, 2024",
        type: "Dashboard",
        people: ["DT"],
        priority: "Low",
      },
    ],
  },
  {
    title: "In Review",
    tasks: [
      {
        id: "7",
        name: "Customer Role",
        description: "-",
        estimation: "Feb 14, 2024 - Feb 1, 2024",
        type: "Dashboard",
        people: ["AI", "DT"],
        priority: "Medium",
      },
      {
        id: "8",
        name: "Admin Role",
        description:
          "Set up with relevant information such as profile picture, phone number etc",
        estimation: "Feb 14, 2024 - Feb 1, 2024",
        type: "Mobile App",
        people: ["AI", "DT"],
        priority: "High",
      },
    ],
  },
];

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskSection[]>(initialTasks);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({
    "To-do": true,
    "In Progress": true,
    "In Review": true,
  });

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // If there's no destination or dropped in the same position, do nothing
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const sourceSectionIndex = tasks.findIndex(
      (section) => section.title === source.droppableId
    );
    const destSectionIndex = tasks.findIndex(
      (section) => section.title === destination.droppableId
    );

    // Create copies of the task arrays
    const sourceTasks = [...tasks[sourceSectionIndex].tasks];
    const destTasks = [...tasks[destSectionIndex].tasks];

    // Remove the task from the source
    const [movedTask] = sourceTasks.splice(source.index, 1);

    // Add the task to the destination
    destTasks.splice(destination.index, 0, movedTask);

    // Update the state with the new task arrays
    const updatedTasks = [...tasks];
    updatedTasks[sourceSectionIndex] = {
      ...tasks[sourceSectionIndex],
      tasks: sourceTasks,
    };
    updatedTasks[destSectionIndex] = {
      ...tasks[destSectionIndex],
      tasks: destTasks,
    };

    setTasks(updatedTasks);
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
                        <List className="inline-block mr-1" size={18} />
                        Select
                      </th>
                      <th className=" border p-2 justify-center items-center text-gray-600 text-xs">
                        <List className="inline-block mr-1" size={18} />
                        Task Name
                      </th>
                      <th className=" border p-2 justify-center items-center text-gray-600 text-xs">
                        <List className="inline-block mr-1" size={18} />
                        Description
                      </th>
                      <th className=" border p-2 justify-center items-center text-gray-600 text-xs">
                        <List className="inline-block mr-1" size={18} />
                        Estimation
                      </th>
                      <th className=" border p-2 justify-center items-center text-gray-600 text-xs">
                        <List className="inline-block mr-1" size={18} />
                        Type
                      </th>
                      <th className=" border p-2 justify-center items-center text-gray-600 text-xs">
                        <List className="inline-block mr-1" size={18} />
                        People
                      </th>
                      <th className=" border p-2 justify-center items-center text-gray-600 text-xs">
                        <List className="inline-block mr-1" size={18} />
                        Priority
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
                              <Checkbox id={task.id} />
                            </td>
                            <td className="border p-2">{task.name}</td>
                            <td className="border p-2">{task.description}</td>
                            <td className="border p-2">{task.estimation}</td>
                            <td className="border p-2">{task.type}</td>
                            <td className="border p-2">
                              {task.people.join(", ")}
                            </td>
                            <td className="border p-2">{task.priority}</td>
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
