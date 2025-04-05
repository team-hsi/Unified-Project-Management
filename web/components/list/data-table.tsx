"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query"; // Add this import
import { useTaskLabels } from "@/hooks/use-task-labels";
import { useTableFilter } from "@/hooks/use-table-filter";
import { useTableActions } from "@/hooks/use-table-actions";
import { Item } from "@/components/list/columns";

import { DataTablePagination } from "./data-table-pagination";
import { ListViewSkeleton } from "@/components/list/skeletons";
import { getItems } from "@/actions/item-actions";

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

import { useParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[]; // Make data optional since we'll fetch it
  projectId: string; // Add projectId as a prop
}

export function DataTable<TData extends Item, TValue>({
  data: initialData = [],
}: // Add projectId to props
DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({
    id: false,
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<Item[]>(initialData);
  const { id } = useParams<{ id: string }>();

  const { data: fetchedData, isLoading } = useSuspenseQuery({
    queryKey: ["items", id],
    queryFn: getItems,
  });

  // const { setLabel, getLabel } = useTaskLabels();
  const { filteredData, searchQuery, handleSearchChange } = useTableFilter(
    fetchedData || data
  );

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
    // setLabel,
    // getLabel,
    onUpdateItem: handleUpdateItem,
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

  if (isLoading) {
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
