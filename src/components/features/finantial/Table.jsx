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
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatCurrency, fromatDate } from "@/lib/utils";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";
import { SelectInput } from "@/components/myUI/select";
import { useReactToPrint } from "react-to-print";
import { RangeDatePickerWithPresets } from "@/components/myUI/rangeDatePacker";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DataTableFinanatial({ data, count, account }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  const prientRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef: prientRef });

  function setFilter() {
    const path = `${pathname}?${
      "page=" +
      table.getState().pagination.pageIndex +
      "&limit=" +
      table.getState().pagination.pageSize +
      `${name && "&name=" + name}${date && "&date=" + date}`
    }`;
    router.push(path);
  }

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
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {fromatDate(row.getValue("date"))}
        </div>
      ),
    },
    {
      accessorKey: "debit",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Debit (-)
          </Button>
        );
      },
      cell: ({ row }) => {
        const debit = parseFloat(row.getValue("debit"));

        // Format the buy as a dollar buy

        return (
          <div className="text-right font-medium text-green-300">
            {debit ? formatCurrency(debit) : 0}
          </div>
        );
      },
    },
    {
      accessorKey: "credit",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Credit (+)
          </Button>
        );
      },
      cell: ({ row }) => {
        const credit = parseFloat(row.getValue("credit"));

        // Format the buy as a dollar buy

        return (
          <div className="text-right font-medium text-red-300">
            {credit ? formatCurrency(credit) : 0}
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
            Balance
          </Button>
        );
      },
      cell: ({ row }) => {
        const balance = parseFloat(row.getValue("balance"));

        // Format the buy as a dollar buy

        return (
          <div
            className={`text-right font-medium ${
              balance > 0 ? "text-green-300" : "text-red-300"
            }`}
          >
            {balance ? formatCurrency(balance) : 0}
          </div>
        );
      },
    },
  ];

  const { totalCredit, totalDebit } = useMemo(() => {
    const totalCredit = data.reduce((sum, acc) => sum + acc.credit, 0);
    const totalDebit = data.reduce((sum, acc) => sum + acc.debit, 0);

    return { totalCredit, totalDebit };
  }, [data]);

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

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between py-4 gap-3">
        <div className="flex gap-4">
          <AutoCompleteV2
            value={name}
            onChange={setName}
            type="buyer-saller"
            label="جستحو با حساب"
          />
          <RangeDatePickerWithPresets
            date={date}
            onDate={(event) => setDate(event)}
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
        </div>
      </div>
      <div className="rounded-md border" ref={prientRef}>
        <div className="flex items-center flex-col w-full">
          <div className="flex flex-row gap-2">
            <h2>{account?.name}</h2>
            <h2>Statement </h2>
          </div>
          <div className="flex flex-row gap-2">
            <h2> {account?.phoneNumber || ""}</h2>
            <span>:</span>
            <h2>PhoneNumber</h2>
          </div>
          <div className="flex flex-row gap-2">
            <h2>
              {fromatDate(table.getColumn("date")?.getFilterValue()?.[0])}
            </h2>
            <span>-</span>
            <h2>
              {fromatDate(table.getColumn("date")?.getFilterValue()?.[1])}
            </h2>
          </div>
        </div>
        <Card className={"mx-10 rounded-none my-5  "}>
          <CardContent className="flex h-15 justify-center items-center space-x-4 text-sm">
            <div>
              <h3>RunningBalance</h3>{" "}
              <h4
                className={
                  account?.borrow - account?.lend > 0
                    ? "text-green-300"
                    : "text-red-300"
                }
              >
                {formatCurrency(account?.borrow - account?.lend)}
              </h4>
              <h4>
                (
                {account?.borrow - account?.lend > 0 ? "will pay" : "will give"}
                )
              </h4>
              <h5>{fromatDate(new Date())}</h5>
            </div>
            <Separator orientation="vertical" />
            <div>
              <h3>TotalDebit</h3>{" "}
              <h4 className="text-green-400">{formatCurrency(totalDebit)}</h4>
            </div>
            <Separator orientation="vertical" />
            <div>
              <h3>TotalCredit</h3>{" "}
              <h4 className="text-red-400">{formatCurrency(totalCredit)}</h4>
            </div>
            <Separator orientation="vertical" />
            <div>
              <h3>OpeningBalance</h3>
              <h4
                className={
                  account?.initBalanceType === "lend"
                    ? "text-red-300"
                    : "text-green-300"
                }
              >
                {formatCurrency(account?.initBalance || 0)}
              </h4>
            </div>
          </CardContent>
        </Card>
        <Separator />
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
          {/* <TableFooter>
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
          </TableFooter> */}
        </Table>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4">
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
      </div> */}
    </div>
  );
}
