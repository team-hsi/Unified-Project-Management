import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects page",
};

const Page = async () => {
  return <div className="max-h-full overflow-hidden">Projects page</div>;
};

export default Page;
