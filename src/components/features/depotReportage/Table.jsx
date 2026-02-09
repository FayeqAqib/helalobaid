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
import { useEffect, useRef, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { formatCurrency } from "@/lib/utils";

import { SelectInput } from "@/components/myUI/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import jalaali from "moment-jalaali";
import { useReactToPrint } from "react-to-print";

export function DataTableDepotReportage({ data, count, expir, params }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
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
      }&${"depot=" + params}&${
        "page=" +
        table.getState().pagination.pageIndex +
        "&limit=" +
        table.getState().pagination.pageSize
      }`,
    );
  }

  const columns = [
    {
      accessorKey: "product",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            محصول
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const original = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={original?.image} alt={original?.product.name} />
              <AvatarFallback>
                <span className="uppercase ">
                  {original?.product.name.slice(0, 2)}
                </span>
              </AvatarFallback>
            </Avatar>
            <div className="lowercase">{original.product.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "brand",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            نام تجاری <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("product")?.brand}</div>
      ),
    },
    {
      accessorKey: "comanyName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            نام کمپنی <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("product")?.companyName}</div>
      ),
    },
    {
      accessorKey: "unit",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            واحد <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("unit")?.name}</div>
      ),
    },
    {
      accessorKey: "count",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            تعداد
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("count")}</div>
      ),
    },
    {
      accessorKey: "aveUnitAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            قیمت فی واحد
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const totalAveUnitAmount = parseFloat(row.getValue("aveUnitAmount"));

        // Format the amount as a dollar amount

        return (
          <div className="text-right font-medium">
            {formatCurrency(totalAveUnitAmount)}
          </div>
        );
      },
    },
    {
      accessorKey: "expirationDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            نام کمپنی <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("expirationDate");
        return (
          <div className="lowercase">
            {date && jalaali(date).format("jYYYY/jMM/jDD")}
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
        const original = row.original;
        const today = new Date();
        const fifteenDaysLater = new Date();
        const meData = fifteenDaysLater.setDate(
          today.getDate() + expir.expiring,
        );

        if (original.count <= 0) {
          return (
            <div className="text-right font-medium">
              <Badge className={"bg-red-500 px-2 pb-1 pt-0"}>نا موجود</Badge>
            </div>
          );
        }
        if (
          original.expirationDate !== null &&
          new Date(original.expirationDate) <= fifteenDaysLater
        ) {
          return (
            <div className="text-right font-medium">
              <Badge className={"bg-violet-500 px-2 pb-1 pt-0"}>
                تاریخ گذشته
              </Badge>
            </div>
          );
        }
        if (
          // original.expirationDate !== null &&
          new Date(original.expirationDate) <= meData
        ) {
          return (
            <div className="text-right font-medium">
              <Badge className={"bg-yellow-500 px-2 pb-1 pt-0"}>
                رو به انقضاء
              </Badge>
            </div>
          );
        }
        if (original.count <= expir.count) {
          return (
            <div className="text-right font-medium">
              <Badge className={"bg-gray-500 px-2 pb-1 pt-0"}>روبه اتمام</Badge>
            </div>
          );
        }
        if (original.count > expir.count) {
          return (
            <div className="text-right font-medium">
              <Badge className={"bg-green-500 backdrop-blur-md px-2 pb-1 pt-0"}>
                موجود
              </Badge>
            </div>
          );
        }
      },
    },
  ];

  const prientRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef: prientRef });

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
      <div className="">
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
                            header.getContext(),
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
                        cell.getContext(),
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
      <div className="flex items-center justify-end space-x-2 mx-5 pt-4">
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
            ]}
          />
        </div>
        <Button onClick={reactToPrintFn}> چاپ </Button>
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
