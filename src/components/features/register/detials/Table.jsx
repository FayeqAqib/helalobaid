"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { DatePickerWithPresets } from "@/components/myUI/datePacker";
import { usePathname, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import moment from "moment-jalaali";

export const columns = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاریخ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {moment(row.getValue("date")).format("jYYYY/jMM/jDD")}
      </div>
    ),
  },
  {
    accessorKey: "buyCashAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          خرید نقد
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const buyCashAmount = parseFloat(row.getValue("buyCashAmount"));

      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {buyCashAmount ? formatCurrency(buyCashAmount) : 0}
        </div>
      );
    },
  },
  {
    accessorKey: "saleCashAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          فروش نقد
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const saleCashAmount = parseFloat(row.getValue("saleCashAmount"));

      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {saleCashAmount ? formatCurrency(saleCashAmount) : 0}
        </div>
      );
    },
  },
  {
    accessorKey: "borrowAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          خرید قرض
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const borrowAmount = parseFloat(row.getValue("borrowAmount"));

      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {borrowAmount ? formatCurrency(borrowAmount) : 0}
        </div>
      );
    },
  },

  {
    accessorKey: "lendAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          فروش قرض
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const lendAmount = parseFloat(row.getValue("lendAmount"));

      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {lendAmount ? formatCurrency(lendAmount) : 0}
        </div>
      );
    },
  },

  {
    accessorKey: "payAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          پرداخت قرض
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const payAmount = parseFloat(row.getValue("payAmount"));

      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {payAmount ? formatCurrency(payAmount) : 0}
        </div>
      );
    },
  },
  {
    accessorKey: "receiveAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          دربافت قرض
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const receiveAmount = parseFloat(row.getValue("receiveAmount"));

      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {receiveAmount ? formatCurrency(receiveAmount) : 0}
        </div>
      );
    },
  },
  {
    accessorKey: "details",
    header: "تفصیلات",
    cell: ({ row }) => (
      <div className="lowercase max-w-[250px] overflow-clip">
        {row.getValue("details")}
      </div>
    ),
  },
];

export function DataTableDetils({ data, count }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  function setFilter() {
    router.push(
      `${pathname}?${
        "page=" + table.getState().pagination.pageIndex + "&limit=4"
      }`
    );
  }

  const table = useReactTable({
    data,
    columns,
    rowCount: count,
    pageCount: count > 4 ? count / 4 : 1,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    manualFiltering: true, // Important: disables client filtering
    manualPagination: true, // If you want server-side pagination
    manualSorting: true, // If you want server-side sorting
  });

  useEffect(() => {
    setFilter();
  }, [sorting, table.getState().pagination.pageIndex]);
  return (
    <div className="w-full">
      <div className="flex items-stretch py-4 gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              ستون ها <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button>تعداد معاملات {count}</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={"text-right"}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                    <TableCell key={cell.id}>
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
                  نتیجه ای یافت نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getState().pagination.pageIndex + 1} از {table.getPageCount()}{" "}
          صفحه
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            قبلی
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            بعدی
          </Button>
        </div>
      </div>
    </div>
  );
}
