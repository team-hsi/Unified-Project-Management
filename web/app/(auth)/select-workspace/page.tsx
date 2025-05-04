import { getUserWorkspaces } from "@/feature/shared/actions/api/workspace/queries";
import SelectWorkspace from "@/feature/shared/components/workspace/select-space";

const page = async () => {
  const workspaces = await getUserWorkspaces();
  console.log("workspaces-page", workspaces);

  return <SelectWorkspace workspaces={workspaces} />;
};

export default page;
