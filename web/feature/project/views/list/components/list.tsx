import { columns } from "./columns";
import { DataTable } from "./data-table";

export const ListView = async () => {
  return (
    <div className="container mx-auto">
      <DataTable columns={columns} />
    </div>
  );
};
