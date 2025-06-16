"use client";

import {
  ArrowUpDown,
  ChevronDown,
  FilePenLine,
  MoreHorizontal,
  ShoppingBasket,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { PayModal } from "./PayModal";
import { DatePickerWithPresets } from "@/components/myUI/datePacker";
import { usePathname, useRouter } from "next/navigation";
import ConfirmDelete from "./ConfirmDelete";
import { DialogTrigger } from "@radix-ui/react-dialog";

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
    accessorKey: "saller",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          دریافت کننده
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("saller")?.name}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          مقدار پول
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      return (
        <div className="text-right font-medium">{formatCurrency(amount)}</div>
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      const [openDelete, setOpenDelete] = useState(false);
      const [openBuy, setOpenBuy] = useState(false);
      return (
        <PayModal
          key={openBuy}
          data={payment}
          type="update"
          open={openBuy}
          onOpen={setOpenBuy}
        >
          <ConfirmDelete
            data={payment}
            open={openDelete}
            onOpen={setOpenDelete}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className={" text-right"}>
                  صلاحیت ها
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(payment.id)}
                >
                  <Button
                    onClick={() => setOpenBuy((openBuy) => !openBuy)}
                    variant={"ghost"}
                    className={"w-full justify-end"}
                  >
                    <span>تصحیح</span>
                    <FilePenLine size={32} strokeWidth={1.75} color="green" />
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    onClick={() => setOpenDelete((openDelete) => !openDelete)}
                    variant={"ghost"}
                    className={"w-full justify-end"}
                  >
                    <span>حذف</span>
                    <Trash2 size={32} strokeWidth={1.75} color={"red"} />
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ConfirmDelete>
        </PayModal>
      );
    },
  },
];

export function DataTablePay({ data, count }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function setFilter() {
    router.push(
      `${pathname}?${
        sorting.length ? "sort=" + sorting[0].id + "," + sorting[0].desc : ""
      }&${
        columnFilters.length
          ? columnFilters
              .map((items) => `${items.id + "=" + items.value}`)
              .join("&")
          : ""
      }&${"page=" + table.getState().pagination.pageIndex + "&limit=10"}`
    );
  }

  const table = useReactTable({
    data,
    columns,
    rowCount: count,
    pageCount: count > 10 ? Math.round(count / 10 + 1) : 1,
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
      <div className="flex items-stretch flex-col md:flex-row justify-between py-4 gap-3">
        <div className="flex gap-4">
          <Input
            placeholder=" جستجو با نام ....."
            value={table.getColumn("saller")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("saller")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DatePickerWithPresets
            date={table.getColumn("date")?.getFilterValue() ?? ""}
            onDate={(event) => table.getColumn("date")?.setFilterValue(event)}
            size="sm"
          />
          <Button onClick={() => setFilter()}>جستجو</Button>
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

          <PayModal open={open} onOpen={setOpen}>
            <DialogTrigger asChild>
              <Button>
                افزودن فروش <ShoppingBasket size={32} strokeWidth={1.75} />
              </Button>
            </DialogTrigger>
          </PayModal>
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
