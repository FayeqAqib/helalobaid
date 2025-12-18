"use client";

import { ChevronDown } from "lucide-react";

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
import { useEffect, useRef, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import moment from "moment-jalaali";
import { RangeDatePickerWithPresets } from "@/components/myUI/rangeDatePacker";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";
import { useReactToPrint } from "react-to-print";
import { SelectInput } from "@/components/myUI/select";

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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("name")}</div>
      );
    },
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
        </Button>
      );
    },
    cell: ({ row }) => {
      const buyCashAmount = parseFloat(row.getValue("buyCashAmount"));
      const currency = row.getValue("currency");
      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {buyCashAmount
            ? formatCurrency(buyCashAmount / currency?.rate, currency?.code)
            : 0}
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
        </Button>
      );
    },
    cell: ({ row }) => {
      const saleCashAmount = parseFloat(row.getValue("saleCashAmount"));
      const currency = row.getValue("currency");

      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {saleCashAmount
            ? formatCurrency(saleCashAmount / currency?.rate, currency?.code)
            : 0}
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
        </Button>
      );
    },
    cell: ({ row }) => {
      const borrowAmount = parseFloat(row.getValue("borrowAmount"));
      const currency = row.getValue("currency");
      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {borrowAmount
            ? formatCurrency(borrowAmount / currency?.rate, currency?.code)
            : 0}
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
        </Button>
      );
    },
    cell: ({ row }) => {
      const lendAmount = parseFloat(row.getValue("lendAmount"));
      const currency = row.getValue("currency");
      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {lendAmount
            ? formatCurrency(lendAmount / currency?.rate, currency?.code)
            : 0}
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
          پرداخت
        </Button>
      );
    },
    cell: ({ row }) => {
      const payAmount = parseFloat(row.getValue("payAmount"));
      const currency = row.getValue("currency");
      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {payAmount
            ? formatCurrency(payAmount / currency?.rate, currency?.code)
            : 0}
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
          دربافت
        </Button>
      );
    },
    cell: ({ row }) => {
      const receiveAmount = parseFloat(row.getValue("receiveAmount"));
      const currency = row.getValue("currency");
      // Format the buy as a dollar buy

      return (
        <div className="text-right font-medium">
          {receiveAmount
            ? formatCurrency(receiveAmount / currency?.rate, currency?.code)
            : 0}
        </div>
      );
    },
  },
  {
    accessorKey: "currency",
    header: "",
    cell: "",
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

export function DataTableExecuttiveReportage({ data, count, account = {} }) {
  const [name, setName] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({
    currency: false,
  });
  const router = useRouter();
  const pathname = usePathname();

  const prientRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef: prientRef });

  function setFilter() {
    router.push(
      `${pathname}?${
        columnFilters.length
          ? columnFilters
              .map((items) => `${items.id + "=" + items.value}`)
              .join("&") + "&"
          : ""
      }&${name ? "name=" + name + "&" : ""}${
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
    <div className="w-full" ref={prientRef}>
      <div className="flex flex-col md:flex-row justify-between py-4 gap-3">
        <div className="flex gap-4">
          <AutoCompleteV2
            value={name}
            onChange={setName}
            label="جستجو با نام"
          />
          <AutoCompleteV2
            value={table.getColumn("currency")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("currency")?.setFilterValue(event)
            }
            dataType="currency"
            label=" واحد پولی را انتخاب کنید.."
          />
          <RangeDatePickerWithPresets
            date={table.getColumn("date")?.getFilterValue() ?? ""}
            onDate={(event) => table.getColumn("date")?.setFilterValue(event)}
            size="sm"
          />
          <Button onClick={() => setFilter()} className={"flex-1"}>
            جستجو
          </Button>
        </div>
        <div className="flex gap-4">
          <Button onClick={reactToPrintFn}> چاپ </Button>
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

          {account?.accountType === "saller" && (
            <Button variant={"secondary"}>{` بلانس : ${formatCurrency(
              account?.borrow
            )}`}</Button>
          )}
          {account?.accountType === "buyer" && (
            <Button variant={"destructive"}>
              {` بلانس : -${formatCurrency(account?.lend)}`}
            </Button>
          )}

          <Button>تعداد معاملات {count}</Button>
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
                    "buyCashAmount",
                    "saleCashAmount",
                    "borrowAmount",
                    "lendAmount",
                    "payAmount",
                    "receiveAmount",
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
              { value: 500, label: "500" },
              { value: 1000, label: "1000" },
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
