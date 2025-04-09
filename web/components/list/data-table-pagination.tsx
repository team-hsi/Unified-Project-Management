// import { Table } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface DataTablePaginationProps<TData> {
//   table: Table<TData>;
// }

// export function DataTablePagination<TData>({
//   table,
// }: DataTablePaginationProps<TData>) {
//   const selectedRows = table.getSelectedRowModel().rows.length;
//   const totalRows = table.getFilteredRowModel().rows.length;

//   return (
//     <div className="flex items-center justify-between space-x-2 py-4">
//       {/* Left side: Row selection info */}
//       <div className="text-sm text-gray-400">
//         {selectedRows} of {totalRows} row(s) selected
//       </div>

//       {/* Right side: Rows per page dropdown and page navigation */}
//       <div className="flex items-center space-x-4">
//         {/* Rows per page dropdown */}
//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-white">Rows per page:</span>
//           <Select
//             value={table.getState().pagination.pageSize.toString()}
//             onValueChange={(value) => {
//               table.setPageSize(Number(value));
//             }}
//           >
//             <SelectTrigger className="w-[70px]">
//               <SelectValue placeholder={table.getState().pagination.pageSize} />
//             </SelectTrigger>
//             <SelectContent>
//               {[10, 20, 30, 40, 50].map((size) => (
//                 <SelectItem key={size} value={size.toString()}>
//                   {size}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Page navigation */}
//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-white">
//             Page {table.getState().pagination.pageIndex + 1} of{" "}
//             {table.getPageCount()}
//           </span>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
