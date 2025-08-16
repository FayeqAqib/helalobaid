"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { usePathname, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";
import { SelectInput } from "@/components/myUI/select";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          حساب
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name");

      // Format the buy as a dollar buy

      return <div className="text-right font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "borrow",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          قرضه
        </Button>
      );
    },
    cell: ({ row }) => {
      const borrow = parseFloat(row.getValue("borrow"));

      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {borrow ? formatCurrency(borrow) : 0}
        </div>
      );
    },
  },
  {
    accessorKey: "lend",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          طلب
        </Button>
      );
    },
    cell: ({ row }) => {
      const lend = parseFloat(row.getValue("lend"));

      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {lend ? formatCurrency(lend) : 0}
        </div>
      );
    },
  },

  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          بیلانس
        </Button>
      );
    },
    cell: ({ row }) => {
      const lend = parseFloat(row.getValue("lend")) || 0;
      const borrow = parseFloat(row.getValue("borrow")) || 0;
      const balance = parseFloat(row.getValue("balance"));

      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {balance ? formatCurrency(balance) : 0}
        </div>
      );
    },
  },

  {
    accessorKey: "T",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تشخیص
        </Button>
      );
    },
    cell: ({ row }) => {
      const lend = parseFloat(row.getValue("lend")) || 0;
      const borrow = parseFloat(row.getValue("borrow")) || 0;
      let T = lend < borrow ? "باقی" : "طلب";
      T = lend === borrow ? "تصفیه" : T;

      // Format the buy as a dollar buy

      return <div className="text-right font-medium">{T}</div>;
    },
  },
];

export function DataTableAbridgedReportage({ data, count }) {
  const [name, setName] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  function setFilter() {
    const path = `${pathname}?${
      "page=" +
      table.getState().pagination.pageIndex +
      "&limit=" +
      table.getState().pagination.pageSize +
      `${name && "&name=" + name}`
    }`;
    router.push(path);
  }

  const table = useReactTable({
    data,
    columns,
    rowCount: count,
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
  }, [
    sorting,
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
  ]);
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between py-4 gap-3">
        <div className="flex gap-4">
          <AutoCompleteV2 value={name} onChange={setName} dataType="vendee" />
          <Button onClick={() => setFilter()} className={"flex-1"}>
            جستجو
          </Button>
        </div>
        <div className="flex gap-4">
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
        </div>
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
          <TableFooter>
            <TableRow
              className={
                "bg-[var(--secondary-foreground)] text-[var(--secondary)] hover:bg-[var(--muted-foreground)]"
              }
            >
              {table.getFooterGroups()[0].headers.map((footer, idx) => (
                <TableCell
                  key={footer.id || idx}
                  className="text-right font-bold "
                >
                  {["borrow", "lend", "belance"].includes(footer.id)
                    ? formatCurrency(
                        table
                          .getRowModel()
                          .rows.reduce(
                            (sum, row) =>
                              sum + (parseFloat(row.getValue(footer.id)) || 0),
                            0
                          )
                      )
                    : ["name"].includes(footer.id) && "مجموع"}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 flex text-sm text-muted-foreground gap-4 items-center">
          <h3>
            {table.getState().pagination.pageIndex + 1} از{" "}
            {table.getPageCount()} صفحه
          </h3>

          <SelectInput
            field={{
              value: table.getState().pagination.pageSize,
              onChange: table.setPageSize,
            }}
            lable={"تعداد آیتم در هر صفحه"}
            options={[
              { value: 10, label: "10" },
              { value: 20, label: "20" },
              { value: 30, label: "30" },
            ]}
          />
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
