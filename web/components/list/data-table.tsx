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

import { DataTablePagination } from "./data-table-pagination";
import { ListViewSkeleton } from "@/components/list/skeletons";

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
  data: initialData = [],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({
    id: false, // Hide the 'id' column by default
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true); // Add loading state
  const [data, setData] = useState<Task[]>(initialData); // Local state for data

  const { setLabel, getLabel } = useTaskLabels();
  const { filteredData, searchQuery, handleSearchChange } =
    useTableFilter(data);

  // Define handleUpdateTask before using it in getColumns
  const handleUpdateTask = (updatedTask: Task) => {
    setData(
      (prevData) =>
        updatedTask.id
          ? prevData.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          : prevData.filter((task) => task.id !== updatedTask.id) // For deletion
    );
  };

  // Now that handleUpdateTask is defined, we can use it in getColumns
  const columns = getColumns({
    setLabel,
    getLabel,
    onUpdateTask: handleUpdateTask,
  });

  const {
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

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/v1/items/getall");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        alert("Failed to fetch tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <ListViewSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Header with Search, Export, and View Buttons */}
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
