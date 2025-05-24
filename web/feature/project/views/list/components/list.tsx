import { columns } from "./columns";
import { DataTable } from "./data-table";

export const ListView = () => {
  return (
    <div className="container mx-auto">
      <DataTable columns={columns} />
    </div>
  );
};
