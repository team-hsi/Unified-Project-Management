"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTableFilter } from "@/hooks/use-table-filter";
import { useTableActions } from "@/hooks/use-table-actions";
import { Item } from "@/components/list/columns";
import { ItemSheet } from "../sheets/item-sheet";
import { DataTablePagination } from "./data-table-pagination";
import { ListViewSkeleton } from "@/components/list/skeletons";
import { getItems, editItem, deleteItem } from "@/actions/item-actions";
import { Download, ChevronUpDown, FineTune, Plus } from "@mynaui/icons-react";
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
import { getQueryClient } from "@/lib/query-client/get-query-client";

interface DataTableProps<TData, TValue> {
  columns?: ColumnDef<TData, TValue>[];
  data?: TData[];
  projectId: string;
}

export function DataTable<TData extends Item, TValue>({
  data: initialData = [],
  projectId,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({ id: false });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const queryClient = getQueryClient();

  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ["items", projectId],
    queryFn: getItems,
  });

  const { filteredData, searchQuery, handleSearchChange } = useTableFilter(
    fetchedData || initialData
  );

  const editMutation = useMutation({
    mutationFn: ({
      itemId,
      values,
    }: {
      itemId: string;
      values: Partial<Item>;
    }) => editItem(itemId, values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["items", projectId] }),
    onError: (error) => {
      console.error("Error updating item:", error);
      alert("Failed to update item. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => deleteItem(itemId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["items", projectId] }),
    onError: (error) => {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    },
  });

  const handleUpdateItem = useCallback((item: Item) => {
    setSelectedItem(item);
  }, []);

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      deleteMutation.mutate(itemId);
    },
    [deleteMutation]
  );

  const handleSaveItem = useCallback(
    (updatedItem: Item) => {
      editMutation.mutate({
        itemId: updatedItem.id,
        values: {
          name: updatedItem.name,
          description: updatedItem.description,
          id: updatedItem.bucketId,
        },
      });
    },
    [editMutation]
  );

  const columns = getColumns({
    onUpdateItem: handleUpdateItem,
    onDeleteItem: handleDeleteItem,
    onSaveItem: handleSaveItem,
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
      pagination: { pageIndex, pageSize },
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

  const handleNewItem = () => {
    setSelectedItem({
      id: "",
      name: "",
      description: "",
      bucketId: "",
      startDate: "",
      dueDate: "",
      priority: "low",
      status: "todo",
      labels: [],
    });
  };

  if (isLoading) {
    return <ListViewSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full sm:max-w-xs"
          />
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="w-full sm:w-auto flex items-center space-x-2">
            <Button
              onClick={handleNewItem}
              className="w-full sm:w-auto cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <Button
            onClick={handleExport}
            className="w-full sm:w-auto cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
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
                const columnId = column.id as string;

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
      <div className="responsive-table-container rounded-md border">
        <Table className="responsive-table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-2 whitespace-nowrap"
                  >
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
                    <TableCell
                      key={cell.id}
                      className="px-4 py-2 whitespace-nowrap"
                    >
                      <ItemSheet item={row.original}>
                        <div>
                          <div
                            className="cursor-pointer"
                            onClick={() => handleUpdateItem(row.original)}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </div>
                      </ItemSheet>
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
