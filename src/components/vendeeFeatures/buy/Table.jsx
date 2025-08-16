"use client";

import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  ShoppingBasket,
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

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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

import { usePathname, useRouter } from "next/navigation";

import { formatCurrency, formatNumber } from "@/lib/utils";
import moment from "moment-jalaali";
import { RangeDatePickerWithPresets } from "@/components/myUI/rangeDatePacker";

import { SelectInput } from "@/components/myUI/select";
import { DetailsModal } from "@/components/myUI/DetailsModal";
import { HiEye } from "react-icons/hi2";

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
    accessorKey: "cashAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          مقدار رسید
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const cashAmount = parseFloat(row.getValue("cashAmount"));

      return (
        <div className="text-right font-medium">
          {formatCurrency(cashAmount)}
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
          مقدار باقی
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const lendAmount = parseFloat(row.getValue("lendAmount"));

      return (
        <div className="text-right font-medium">
          {formatCurrency(lendAmount)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          مجموع پول
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const totalAmount = parseFloat(row.getValue("totalAmount"));

      return (
        <div className="text-right font-medium">
          {formatCurrency(totalAmount)}
        </div>
      );
    },
  },
  {
    accessorKey: "cent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          فیصدی
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("cent")}%</div>,
  },
  {
    accessorKey: "metuAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اندازه METU
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metuAmount = parseFloat(row.getValue("metuAmount"));

      return (
        <div className="text-right font-medium">{formatNumber(metuAmount)}</div>
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
      const [openDetails, setOpenDetails] = useState(false);
      return (
        <DetailsModal
          data={{ ...payment, name: payment.buyer.name }}
          open={openDetails}
          onChange={setOpenDetails}
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
              <DropdownMenuItem>
                <Button
                  onClick={() => setOpenDetails((openDetails) => !openDetails)}
                  variant={"ghost"}
                  className={"w-full justify-end"}
                >
                  <span>دیدن جذیات</span>
                  <HiEye size={32} strokeWidth={1.75} />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DetailsModal>
      );
    },
  },
];

export function DataTableBuy({ data, count }) {
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
      }&${
        "page=" +
        table.getState().pagination.pageIndex +
        "&limit=" +
        table.getState().pagination.pageSize
      }`
    );
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
      <div className="flex items-stretch flex-col md:flex-row justify-between py-4 gap-3">
        <div className="flex flex-wrap gap-2">
          <RangeDatePickerWithPresets
            date={table.getColumn("date")?.getFilterValue() ?? ""}
            onDate={(event) => table.getColumn("date")?.setFilterValue(event)}
            size="sm"
          />
          <Button onClick={() => setFilter()} className={"flex-1"}>
            جستجو
          </Button>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto flex-1">
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
            {table?.getRowModel()?.rows?.length ? (
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
                  {[
                    "metuAmount",
                    "totalAmount",
                    "borrowAmount",
                    "cashAmount",
                  ].includes(footer.id)
                    ? formatCurrency(
                        table
                          .getRowModel()
                          .rows.reduce(
                            (sum, row) =>
                              sum + (parseFloat(row.getValue(footer.id)) || 0),
                            0
                          )
                      )
                    : ["date"].includes(footer.id) && "مجموع"}
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
