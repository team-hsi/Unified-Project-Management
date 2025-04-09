import { DataTable } from "@/components/list/data-table";
import { columns } from "./columns";

export const ListView = async () => {
  return (
    <div className="container mx-auto">
      <DataTable columns={columns} />
    </div>
  );
};
