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
import { useEffect, useRef, useState } from "react";

import { DatePickerWithPresets } from "@/components/myUI/datePacker";
import { usePathname, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";

export function DataTableLedger({ data, metuBalance, currency }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({ currency: false });
  const router = useRouter();
  const pathname = usePathname();

  function setFilter(page = {}) {
    router.push(
      `${pathname}?${
        sorting.length ? "sort=" + sorting[0].id + "," + sorting[0].desc : ""
      }&${
        columnFilters.length
          ? columnFilters
              .map((items) => `${items.id + "=" + items.value}`)
              .join("&")
          : ""
      }&${"page=" + page.pageIndex + "&limit=" + page.pageSize}`
    );
  }

  const prientRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef: prientRef });

  //  useEffect(() => {
  //     setFilter();
  //   }, [sorting ,getPaginationRowModel().pagination.pageIndex]);

  const columns = [
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
        <div className="capitalize">{row.getValue("date")}</div>
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
            {formatCurrency(buyCashAmount, currency.code)}
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
            {formatCurrency(saleCashAmount, currency.code)}
          </div>
        );
      },
    },

    {
      accessorKey: "buyBorrowAmount",
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
        const buyBorrowAmount = parseFloat(row.getValue("buyBorrowAmount"));

        // Format the buy as a dollar buy

        return (
          <div className="text-right font-medium">
            {formatCurrency(buyBorrowAmount, currency.code)}
          </div>
        );
      },
    },
    {
      accessorKey: "saleLendAmount",
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
        const saleLendAmount = parseFloat(row.getValue("saleLendAmount"));

        // Format the buy as a dollar buy

        return (
          <div className="text-right font-medium">
            {formatCurrency(saleLendAmount, currency.code)}
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
            {formatCurrency(payAmount, currency.code)}
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
            {formatCurrency(receiveAmount, currency.code)}
          </div>
        );
      },
    },

    {
      accessorKey: "currency",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            واحد پولی
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("currency")?.name}</div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
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
    setFilter(table.getState().pagination);
  }, [sorting, table.getState().pagination.pageIndex]);

  return (
    <div className="w-full" ref={prientRef}>
      <div className="flex items-stretch flex-col md:flex-row justify-between py-4 gap-3">
        <div className="flex gap-4">
          <DatePickerWithPresets
            date={table.getColumn("date")?.getFilterValue() ?? ""}
            onDate={(event) => table.getColumn("date")?.setFilterValue(event)}
            onlyMonthPicker={true}
          />

          <AutoCompleteV2
            value={table.getColumn("currency")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("currency")?.setFilterValue(event)
            }
            dataType="currency"
            label=" واحد پولی را انتخاب کنید.."
          />

          <Button onClick={() => setFilter()}>جستجو</Button>
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

          <Button variant={"outline"}>
            <span> موجودی :</span>
            {formatCurrency(metuBalance / currency.rate, currency.code)}
          </Button>
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
            {table?.getRowModel().rows?.length ? (
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
                    "payAmount",
                    "receiveAmount",
                    "buyCashAmount",
                    "saleCashAmount",
                    "buyBorrowAmount",
                    "saleLendAmount",
                  ].includes(footer.id)
                    ? formatCurrency(
                        table
                          .getRowModel()
                          .rows.reduce(
                            (sum, row) =>
                              sum + (parseFloat(row.getValue(footer.id)) || 0),
                            0
                          ),
                        currency.code
                      )
                    : "مجموع"}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
