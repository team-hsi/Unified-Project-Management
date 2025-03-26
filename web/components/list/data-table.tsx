"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { useTaskLabels } from "@/hooks/use-task-labels";
import { useTableFilter } from "@/hooks/use-table-filter";
import { useTableActions } from "@/hooks/use-table-actions";
import { Task } from "@/components/list/columns";

// Import the DataTablePagination component
import { DataTablePagination } from "./data-table-pagination";
// Import the ListViewSkeleton component
import { ListViewSkeleton } from "@/components/list/skeletons";

// Import icons for the buttons
import { Plus, Download, ChevronUpDown, FineTune } from "@mynaui/icons-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

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
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true); // Add loading state

  const { setLabel, getLabel } = useTaskLabels();
  const { filteredData, searchQuery, handleSearchChange } =
    useTableFilter(data);

  const columns = getColumns({ setLabel, getLabel });

  const {
    handleAddTask,
    handleExport,
    columnSearchQuery,
    handleColumnSearchChange,
    filteredColumns,
    toggleColumnVisibility,
  } = useTableActions({
    columns,
    data: filteredData,
    columnVisibility,
    setColumnVisibility,
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      columnVisibility,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    enableRowSelection: true,
    manualPagination: false,
  });

  // Simulate loading delay (replace with actual data fetching logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate 2-second loading delay
    return () => clearTimeout(timer);
  }, []);

  // Conditionally render the skeleton or the table
  if (loading) {
    return <ListViewSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Header with Search, Add Task, Export, and View Buttons */}
      <div className="flex items-center justify-between">
        {/* Search by Title */}
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FineTune className="h-4 w-4 mr-1" />
                View
                <ChevronUpDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
              <div className="px-2 py-1">
                <Input
                  type="text"
                  placeholder="Search columns..."
                  value={columnSearchQuery}
                  onChange={handleColumnSearchChange}
                  className="w-full"
                />
              </div>
              <DropdownMenuSeparator />
              {filteredColumns.map((column) => {
                const columnId = column.id || column.accessorKey;
                if (
                  !columnId ||
                  columnId === "select" ||
                  columnId === "actions"
                ) {
                  return null; // Skip 'select' and 'actions' columns
                }
                return (
                  <DropdownMenuCheckboxItem
                    key={columnId}
                    checked={columnVisibility[columnId] !== false}
                    onCheckedChange={() => toggleColumnVisibility(columnId)}
                  >
                    {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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

      {/* Pagination Controls */}
      <DataTablePagination table={table} />
    </div>
  );
}
