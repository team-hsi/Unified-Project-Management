"use client";

import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/feature/shared/ui/card";
import { Button } from "@/feature/shared/ui/button";
import { Progress } from "@/feature/shared/ui/progress";
import { Badge } from "@/feature/shared/ui/badge";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProjectMatrix } from "@/actions/api/project/queries";
import Link from "next/link";

const ProjectDashboard = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();
  const { data: projectData } = useSuspenseQuery({
    queryKey: [projectId, "project-dashboard"],
    queryFn: () => getProjectMatrix({ id: projectId }),
    retry: false,
  });
  const projectMetrics = [
    {
      title: "Total Tasks",
      value: projectData.counts.total.toString(),
      icon: CheckCircle,
      color: "blue",
    },
    {
      title: "Completed",
      value: projectData.counts.done.toString(),
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "In Progress",
      value: projectData.counts.inprogress.toString(),
      icon: Clock,
      color: "orange",
    },
    {
      title: "Overdue",
      value: projectData.counts.overdue.toString(),
      icon: AlertTriangle,
      color: "red",
    },
  ];

  const completionPercentage =
    projectData.counts.total > 0
      ? Math.round((projectData.counts.done / projectData.counts.total) * 100)
      : 0;

  return (
    <div className="p-6 space-y-6 animate-fade-in overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-foreground">
              {projectData.project.name}
            </h1>
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
              {projectData.counts.overdue > 0 ? "At Risk" : "On Track"}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link href={`/${workspaceId}/${projectId}/tasks`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              View Task
            </Button>
          </Link>
          <Link href={`/${workspaceId}/${projectId}/documents`}>
            <Button
              variant="outline"
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Docs
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Project Progress
              </h3>
              <p className="text-muted-foreground">
                Overall completion: {completionPercentage}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-semibold text-foreground">
                {new Date(projectData.project.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {projectData.counts.done} of {projectData.counts.total} tasks
              completed
            </span>
            <span>
              {projectData.counts.total - projectData.counts.done} tasks
              remaining
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projectMetrics.map((metric) => (
          <Card
            key={metric.title}
            className="hover:shadow-lg transition-shadow duration-200 hover:scale-[1.02]"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${metric.color}-100/50`}>
                  <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Current task status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">To Do</span>
                <span className="text-sm font-medium text-foreground">
                  {projectData.counts.todo}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  In Progress
                </span>
                <span className="text-sm font-medium text-foreground">
                  {projectData.counts.inprogress}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm font-medium text-foreground">
                  {projectData.counts.done}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Unassigned
                </span>
                <span className="text-sm font-medium text-foreground">
                  {projectData.counts.unassigned}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Info</CardTitle>
            <CardDescription>Project details and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(projectData.project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Last Updated
                </span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(projectData.project.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Priority Tasks
                </span>
                <span className="text-sm font-medium text-foreground">
                  {projectData.counts.priority}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Overdue Tasks
                </span>
                <span className="text-sm font-medium text-foreground">
                  {projectData.counts.overdue}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDashboard;
