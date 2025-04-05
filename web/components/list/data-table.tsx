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
import { Item } from "@/components/list/columns";

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

export function DataTable<TData extends Item, TValue>({
  data: initialData = [],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({
    id: false, // Hide the 'id' column by default
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Item[]>(initialData);

  const { setLabel, getLabel } = useTaskLabels();
  const { filteredData, searchQuery, handleSearchChange } =
    useTableFilter(data);

  const handleUpdateItem = (updatedItem: Item) => {
    setData((prevData) =>
      updatedItem.id
        ? prevData.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        : prevData.filter((item) => item.id !== updatedItem.id)
    );
  };

  const columns = getColumns({
    setLabel,
    getLabel,
    onUpdateItem: handleUpdateItem,
  });

  const {
    handleAddItem,
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/v1/items/getall");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // Map the API response to the Item type
        const items: Item[] = result.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: "", // Not provided by /v1/items/getall, can fetch via /v1/items/{id} if needed
          status: "Todo", // Default value since not provided by API
          priority: "Low", // Default value since not provided by API
          assignedTo: "", // Default value since not provided by API
          startDate: new Date().toISOString(), // Default value
          dueDate: new Date().toISOString(), // Default value
          bucketId: item.bucketId,
          labels: [], // Default value
          estimatedHours: "", // Default value
        }));
        setData(items);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        alert("Failed to fetch items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <ListViewSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-xs"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
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
                  return null;
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
      <DataTablePagination table={table} />
    </div>
  );
}
