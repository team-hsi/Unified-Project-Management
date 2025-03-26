"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useTaskLabels } from "@/hooks/use-task-labels"; // Existing hook for labels
import { useTableFilter } from "@/hooks/use-table-filter"; // New hook for filtering
import { Task } from "@/components/list/columns"; // Adjust path based on your setup

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"; // Adjust path based on your setup

// Import the columns factory function
import { getColumns } from "@/components/list/columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Task, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({
    id: false, // Hide the 'id' column by default
  });

  // Use the useTaskLabels hook for label functionality
  const { setLabel, getLabel } = useTaskLabels();

  // Use the useTableFilter hook for filtering
  const { filteredData, searchQuery, handleSearchChange } =
    useTableFilter(data);

  // Get the columns with setLabel and getLabel passed as parameters
  const columns = getColumns({ setLabel, getLabel });

  const table = useReactTable({
    data: filteredData, // Use filtered data instead of raw data
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
      columnVisibility,
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
  });

  return (
    <div className="space-y-4">
      {/* Search Input in the Top Left Corner */}
      <div className="flex justify-start">
        <Input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-0 py-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-0 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
