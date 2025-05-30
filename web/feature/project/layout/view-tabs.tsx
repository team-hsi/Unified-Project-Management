"use client";

import { Tabs, TabsList, TabsTrigger } from "@/feature/shared/ui/tabs";
import { FileText, Kanban, List } from "lucide-react";
import * as motion from "motion/react-client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useViewStore } from "@/lib/stores/view-store";
import { useEffect } from "react";

const ProjectTabs = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeView, setActiveView } = useViewStore();

  // Sync URL with store on initial load
  useEffect(() => {
    const viewParam = searchParams.get("view");
    if (
      viewParam &&
      ["kanban", "list", "documents", "timeline"].includes(viewParam)
    ) {
      setActiveView(viewParam as "kanban" | "list" | "documents" | "timeline");
    }
  }, [searchParams, setActiveView]);

  const handleTabChange = (
    view: "kanban" | "list" | "documents" | "timeline"
  ) => {
    setActiveView(view);
    // Update URL without triggering a full page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={activeView}>
      <TabsList className="h-auto rounded-none border-b border-border bg-transparent w-full pb-0">
        <TabsTrigger
          value="kanban"
          onClick={() => handleTabChange("kanban")}
          className="relative data-[state=active]:bg-transparent flex-1 data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
        >
          <Kanban /> Kanban
          {activeView === "kanban" && (
            <motion.div
              className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-[var(--foreground)]"
              layoutId="underline"
              id="underline"
            />
          )}
        </TabsTrigger>
        <TabsTrigger
          value="list"
          onClick={() => handleTabChange("list")}
          className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
        >
          <List /> List
          {activeView === "list" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--foreground)]"
              layoutId="underline"
              id="underline"
            />
          )}
        </TabsTrigger>
        <TabsTrigger
          value="timeline"
          onClick={() => handleTabChange("timeline")}
          className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
        >
          <List /> Timeline
          {activeView === "timeline" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--foreground)]"
              layoutId="underline"
              id="underline"
            />
          )}
        </TabsTrigger>
        <TabsTrigger
          value="documents"
          onClick={() => handleTabChange("documents")}
          className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
        >
          <FileText /> Documents
          {activeView === "documents" && (
            <motion.div
              className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-[var(--foreground)]"
              layoutId="underline"
              id="underline"
            />
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProjectTabs;
