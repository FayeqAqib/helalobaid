"use client";

import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2 } from "lucide-react";

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
import { HiEye, HiForward } from "react-icons/hi2";
import moment from "moment-jalaali";
import { RangeDatePickerWithPresets } from "@/components/myUI/rangeDatePacker";
import { SelectInput } from "@/components/myUI/select";
import { DetailsModal } from "@/components/myUI/DetailsModal";
import { ApplecationModal } from "./ApplecationModal";
import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    accessorKey: "sendDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاریخ ارسال
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
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاریخ تایید
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
    accessorKey: "income",
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
    cell: ({ row }) => {
      const income = row.getValue("income");
      return <div className="capitalize">{income ? income?.name : ""}</div>;
    },
  },
  {
    accessorKey: "buyer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          خریدار
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("buyer").name}</div>
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
      return <div className="lowercase">{formatCurrency(cashAmount)}</div>;
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
      return <div className="lowercase">{formatCurrency(lendAmount)}</div>;
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
      return <div className="lowercase">{formatCurrency(totalAmount)}</div>;
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
    cell: ({ row }) => {
      const cent = parseFloat(row.getValue("cent")) || 0;
      return (
        <div className="lowercase">{cent ? formatNumber(cent) + "%" : ""}</div>
      );
    },
  },
  {
    accessorKey: "metuAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          مقدار METU
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metuAmount = parseFloat(row.getValue("metuAmount")) || 0;

      // Format the amount as a dollar amount

      return (
        <div className="text-right font-medium">
          {metuAmount ? formatNumber(metuAmount) : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          حالت
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status");
      let bg;
      let p;
      if (status === "reject") {
        bg = `bg-red-500 p-2 text-white dark:bg-red-700`;
        p = "رد شده";
      }
      if (status === "pending") {
        bg = `bg-cyan-500 p-2 text-white dark:bg-cyan-700`;
        p = " در حال بررسی";
      }
      if (status === "approved") {
        bg = `bg-green-500 p-2 text-white dark:bg-green-700`;
        p = "تا یید شده";
      }
      // Format the amount as a dollar amount

      return (
        <div className="text-right font-medium">
          <Badge className={bg}>{p}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      const [openApplection, setOpenApplection] = useState(false);
      const [openDetails, setOpenDetails] = useState(false);
      return (
        <ApplecationModal
          key={openApplection}
          data={payment}
          open={openApplection}
          onOpen={setOpenApplection}
        >
          <DetailsModal
            key={payment._id}
            data={{
              ...payment,
              name: payment.buyer.name,
              income: payment?.income?.name || "",
            }}
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

                {payment.status === "pending" && (
                  <DropdownMenuItem>
                    <Button
                      onClick={() =>
                        setOpenApplection((openApplection) => !openApplection)
                      }
                      variant={"ghost"}
                      className={"w-full justify-end"}
                    >
                      <span>ارایه پاسخ</span>
                      <HiForward size={32} strokeWidth={1.75} color="green" />
                    </Button>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Button
                    onClick={() =>
                      setOpenDetails((openDetails) => !openDetails)
                    }
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
        </ApplecationModal>
      );
    },
  },
];

export function DataTableApplecation({ data, count }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  console.log(data);
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
        <div className="flex gap-4 flex-wrap">
          <SelectInput
            field={{
              value: table.getColumn("status")?.getFilterValue() ?? "",
              onChange: (event) =>
                table.getColumn("status")?.setFilterValue(event),
            }}
            lable2={"فیلتر بر اساس حالت "}
            options={[
              { value: "pending", label: "درحال بررسی" },
              { value: "approved", label: "تایید شده" },
              { value: "reject", label: "رد شده" },
            ]}
          />
          <RangeDatePickerWithPresets
            date={table.getColumn("date")?.getFilterValue() ?? ""}
            onDate={(event) => table.getColumn("date")?.setFilterValue(event)}
            dataType="vendee"
            size="sm"
          />
          <Button onClick={() => setFilter()} className={"flex-1"}>
            جستجو
          </Button>
        </div>
        <div className="flex gap-4">
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
                  {[
                    "cashAmount",
                    "lendAmount",
                    "totalAmount",
                    "metuAmount",
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
                    : ["sendDate"].includes(footer.id) && "مجموع"}
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
