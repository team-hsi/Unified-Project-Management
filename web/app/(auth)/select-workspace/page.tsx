import { getUserWorkspaces } from "@/actions/api/workspace/queries";
import SelectWorkspace from "@/feature/workspace/select-space";

const page = async () => {
  const workspaces = await getUserWorkspaces();

  return <SelectWorkspace workspaces={workspaces} />;
};

export default page;
