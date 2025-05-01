import { getUserWorkspaces } from "@/actions/user-actions";
import SelectWorkspace from "@/feature/shared/components/workspace/select-space";

const page = async () => {
  const workspaces = await getUserWorkspaces();
  if (!workspaces.success) {
    return <div>{workspaces.error}</div>;
  }
  return <SelectWorkspace workspaces={workspaces.data} />;
};

export default page;
