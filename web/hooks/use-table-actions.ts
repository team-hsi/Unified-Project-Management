// "use client";

// import { useState, useMemo } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import { Task } from "@/components/list/columns"; // Adjust path based on your setup

// interface UseTableActionsProps<TData> {
//   columns: ColumnDef<TData>[];
//   data: TData[];
//   columnVisibility: Record<string, boolean>;
//   setColumnVisibility: (visibility: Record<string, boolean>) => void;
// }

// export const useTableActions = <TData extends Task>({
//   columns,
//   data,
//   columnVisibility,
//   setColumnVisibility,
// }: UseTableActionsProps<TData>) => {
//   const [columnSearchQuery, setColumnSearchQuery] = useState("");

//   // Handle exporting the table data (placeholder action)
//   const handleExport = () => {
//     const csvContent = [
//       columns.map((col) => col.id || col.accessorKey).join(","),
//       ...data.map((row) =>
//         columns
//           .map((col) => {
//             const value = (row as any)[col.accessorKey as string];
//             return typeof value === "string" ? `"${value}"` : value;
//           })
//           .join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", "table-data.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Handle column search input change
//   const handleColumnSearchChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setColumnSearchQuery(event.target.value);
//   };

//   // Filter columns based on search query
//   const filteredColumns = useMemo(() => {
//     if (!columnSearchQuery.trim()) return columns;

//     return columns.filter((col) => {
//       const columnName = col.id || col.accessorKey || "";
//       return columnName.toLowerCase().includes(columnSearchQuery.toLowerCase());
//     });
//   }, [columns, columnSearchQuery]);

//   // Toggle column visibility
//   const toggleColumnVisibility = (columnId: string) => {
//     setColumnVisibility({
//       ...columnVisibility,
//       [columnId]: !columnVisibility[columnId],
//     });
//   };

//   return {
//     handleExport,
//     columnSearchQuery,
//     handleColumnSearchChange,
//     filteredColumns,
//     toggleColumnVisibility,
//   };
// };
