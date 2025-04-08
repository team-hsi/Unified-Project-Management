"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getUserProjects } from "@/actions/project-actions";
import EmptyProjects from "./empty-projects";

interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserProjects() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects", "user"],
    queryFn: getUserProjects,
  });

  // Filter projects based on search query
  const filteredProjects =
    projects?.data?.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (isLoading) {
    return <ProjectsLoading />;
  }

  if (error) {
    return <ProjectsError error={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">All Projects</h3>
          <Badge variant="outline" className="ml-2">
            {filteredProjects.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="w-full pl-8 sm:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No projects found matching &quot;{searchQuery}&quot;
          </p>
          <Button variant="link" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <EmptyProjects />
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  // Format dates using date-fns
  const createdDate = new Date(project.createdAt);
  const updatedDate = new Date(project.updatedAt);

  const timeAgo = formatDistanceToNow(updatedDate, { addSuffix: true });
  const formattedCreatedDate = format(createdDate, "MMM d, yyyy");

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">
            <Link href={`/projects/${project.id}`} className="hover:underline">
              {project.name}
            </Link>
          </CardTitle>
          <CardDescription className="line-clamp-1">
            Created on {formattedCreatedDate}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit project</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-2">
          <Badge className="bg-slate-500/15 text-slate-600 hover:bg-slate-500/25">
            Project
          </Badge>
          <span className="text-xs text-muted-foreground">
            Updated {timeAgo}
          </span>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Owner ID: {project.ownerId}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/10 px-6 py-3">
        <div className="flex w-full justify-between">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            View Details
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function ProjectsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-muted"></div>
        <div className="h-9 w-32 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-muted"></div>
        ))}
      </div>
    </div>
  );
}

function ProjectsError({ error }: { error: Error }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-destructive/50 p-8 text-center">
      <h3 className="text-lg font-medium text-destructive">
        Error loading projects
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Button variant="outline" className="mt-4">
        Try Again
      </Button>
    </div>
  );
}
