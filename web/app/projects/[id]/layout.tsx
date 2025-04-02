import { Metadata } from "next";

// import { ProjectBreadcrumbs } from "@/components/project/project-breadcrumbs";
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: decodeURIComponent(id),
  };
}

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </>
  );
};

export default ProjectLayout;
