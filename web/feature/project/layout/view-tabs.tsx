"use client";

import { Tabs, TabsList, TabsTrigger } from "@/feature/shared/ui/tabs";
import { FileText, Kanban, List } from "lucide-react";
import * as motion from "motion/react-client";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const ProjectTabs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("view") || "kanban";

  return (
    <Tabs value={activeTab}>
      <TabsList className="h-auto rounded-none border-b border-border bg-transparent w-full pb-0">
        <Link href={`${pathname}?view=kanban`} passHref>
          <TabsTrigger
            value="kanban"
            className="relative data-[state=active]:bg-transparent flex-1 data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <Kanban /> Kanban
            {activeTab === "kanban" && (
              <motion.div
                className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-[var(--foreground)]"
                layoutId="underline"
                id="underline"
              />
            )}
          </TabsTrigger>
        </Link>
        <Link href={`${pathname}?view=list`} passHref>
          <TabsTrigger
            value="list"
            className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <List /> List
            {activeTab === "list" && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--foreground)]"
                layoutId="underline"
                id="underline"
              />
            )}
          </TabsTrigger>
        </Link>
        <Link href={`${pathname}?view=documents`} passHref>
          <TabsTrigger
            value="documents"
            className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <FileText /> Documents
            {activeTab === "documents" && (
              <motion.div
                className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-[var(--foreground)]"
                layoutId="underline"
                id="underline"
              />
            )}
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
};

export default ProjectTabs;
