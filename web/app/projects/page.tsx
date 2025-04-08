import { getUserProjects } from "@/actions/project-actions";
import UserProjects from "@/components/project/user-projects";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects page",
};

const Page = async () => {
  return (
    <div className="max-h-full overflow-hidden">
      <h1>Projects</h1>
      <UserProjects />
    </div>
  );
};

export default Page;
