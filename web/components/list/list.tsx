import { DataTable } from "@/components/list/data-table";
import { getItems } from "@/actions/item-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Item } from "@/components/list/columns";

export const ListView = async () => {
  const data = await getItems();
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
      <DataTable columns={columns} data={data} projectId="list-view" />
    </div>
  );
};
