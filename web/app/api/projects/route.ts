import { Project } from "@/components/project/types";
import { NextResponse } from "next/server";

// Mock projects data
const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Marketing Website",
    description: "Redesign of the company marketing website with new branding",
    createdAt: "2023-01-15T00:00:00.000Z",
  },
  {
    id: "project-2",
    name: "Mobile App Development",
    description: "Build a new mobile app for iOS and Android platforms",
    createdAt: "2023-02-20T00:00:00.000Z",
  },
  {
    id: "project-3",
    name: "CRM Integration",
    description: "Integrate our product with popular CRM systems",
    createdAt: "2023-03-10T00:00:00.000Z",
  },
  {
    id: "project-4",
    name: "Internal Tools",
    description: "Develop internal tools to improve team productivity",
    createdAt: "2023-04-05T00:00:00.000Z",
  },
];

export async function GET() {
  // Mocking fetch projects from an API
  const projects = mockProjects;
  return NextResponse.json(projects);
}
