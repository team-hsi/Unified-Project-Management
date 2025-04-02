"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ProjectFilters from "@/components/project-header/ProjectFilters";
import {
  Search,
  UserPlus,
  Menu,
  KanbanSquare,
  List,
  ChartNoAxesGantt,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useProjectHeaderUtils from "@/hooks/useProjectHeaderUtils";

// Utility function to generate initials
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

interface ProjectHeaderProps {
  projectName: string;
  users: { id: number; name: string; avatarUrl: string }[];
  onInvite?: () => void;
}

const ProjectNav = ({ isMobile }: { isMobile: boolean }) => (
  <nav className="flex items-center justify-between w-auto">
    {!isMobile ? (
      <div className="flex space-x-2">
        <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 text-sm">
          <KanbanSquare /> <span>Kanban</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 text-sm">
          <List /> <span>List</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 text-sm">
          <ChartNoAxesGantt /> <span>Timeline</span>
        </button>
      </div>
    ) : (
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 rounded-md border">
          <Menu className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex items-center gap-2">
            <KanbanSquare className="size-4" /> Kanban
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <List className="size-4" /> List
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <ChartNoAxesGantt className="size-4" /> Timeline
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  </nav>
);

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  users,
  onInvite,
}) => {
  const { isMobile, searchTerm, setSearchTerm, handleSearch, filteredUsers } =
    useProjectHeaderUtils(users);

  return (
    <div className="w-full bg-muted shadow-sm rounded-lg">
      {/* First Row: Project Name, Avatars, and Invite Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 mb-2 sm:mb-4 gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-blue-500 text-white text-lg font-bold rounded-full h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center">
            {projectName[0]}
          </div>
          <h1 className="text-lg sm:text-xl font-semibold">{projectName}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex -space-x-1 sm:-space-x-2">
            {filteredUsers.map((user) => (
              <Avatar key={user.id} className="h-6 sm:h-8 w-6 sm:w-8">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={onInvite}
            size="sm"
            className="h-8 sm:h-10 text-xs sm:text-sm"
          >
            <UserPlus className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
            Invite
          </Button>
        </div>
      </div>

      {/* Second Row: Navigation, Filter, and New Task (Small Screens) */}
      {isMobile ? (
        <>
          <div className="flex items-center justify-between p-3 gap-2">
            <ProjectNav isMobile={isMobile} />
            <div className="flex items-center gap-2">
              <ProjectFilters />
              <Button
                size="sm"
                className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
              >
                New Task
              </Button>
            </div>
          </div>

          {/* Third Row: Search Bar (Small Screens) */}
          <div className="p-3">
            <div className="relative w-full">
              <label htmlFor="search-input" className="sr-only">
                Search
              </label>
              <Search className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
              <input
                id="search-input"
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        /* Second Row: Navigation, Search, Filter, and New Task (Large Screens) */
        <div className="flex items-center justify-between p-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3 w-full sm:flex-1">
            <ProjectNav isMobile={isMobile} />
            <div className="relative flex-1">
              <label htmlFor="search-input" className="sr-only">
                Search
              </label>
              <Search className="absolute left-2 top-2 text-gray-400 w-5 h-5" />
              <input
                id="search-input"
                type="text"
                placeholder="Search..."
                className="pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-64  text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ProjectFilters />
            <Button
              size="sm"
              className="h-10 bg-black hover:bg-blue-600 text-white"
            >
              + New Task
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
