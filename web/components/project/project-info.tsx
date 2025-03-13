"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  KanbanSquare,
  List,
  ChartNoAxesGantt,
  Filter,
  UserPlus
} from "lucide-react";

const ProfileInfo: React.FC = () => {
  return (
    <header className="w-full p-4 bg-white shadow-sm rounded-lg">
      {/* First Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 text-white text-lg font-bold rounded-full h-10 w-10 flex items-center justify-center">
            C
          </div>
          <h1 className="text-xl font-semibold">Craftboard Project</h1>
        </div>

        {/* Right: User Avatars & Invite Button */}
        <div className="flex items-center gap-4">
          {/* Avatars */}
          <div className="flex -space-x-2">
            <Avatar>
              <AvatarImage src="/images/user1.jpg" alt="User 1" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/images/user2.jpg" alt="User 2" />
              <AvatarFallback>DT</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/images/user3.jpg" alt="User 3" />
              <AvatarFallback>+</AvatarFallback>
            </Avatar>
          </div>

          {/* Invite Button with Icon */}
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite
          </Button>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Navigation Tabs with Icons */}
        <Tabs defaultValue="kanban">
          <TabsList>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <KanbanSquare className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <ChartNoAxesGantt className="h-4 w-4" />
              Timeline
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right: Search Bar + Buttons */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Filter & New Task Buttons */}
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>+ New Task</Button>
        </div>
      </div>
    </header>
  );
};

export default ProfileInfo;