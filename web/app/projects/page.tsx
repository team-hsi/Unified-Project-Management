import UserProjects from "@/components/project/user-projects";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects page",
};

const Page = async () => {
  return (
    <div className="max-h-full overflow-hidden p-5">
      <UserProjects />
    </div>
  );
};

export default Page;
