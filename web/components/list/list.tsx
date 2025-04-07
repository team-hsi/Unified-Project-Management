import { DataTable } from "@/components/list/data-table";
import { getData } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";

export interface Item {
  id: string;
  name: string;
  description: string;
  bucketId: string;
  startDate?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
}
export const ListView = async () => {
  const data = await getData();
  const columns: ColumnDef<Item>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "startDate", header: "Start Date" },
    { accessorKey: "dueDate", header: "Due Date" },
    { accessorKey: "priority", header: "Priority" },
    { accessorKey: "status", header: "Status" },
  ];
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} id="list-view" />{" "}
    </div>
  );
};
