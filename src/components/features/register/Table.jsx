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
import { RegisterModal } from "./registerModal";
import { DatePickerWithPresets } from "@/components/myUI/datePacker";
import { usePathname, useRouter } from "next/navigation";
import ConfirmDelete from "./ConfirmDelete";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { HiEye, HiPencil, HiUserPlus } from "react-icons/hi2";
import moment from "moment-jalaali";
import { format } from "date-fns";
import Link from "next/link";

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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          اسم
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "accountType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          نوع حساب
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const accountType = row.getValue("accountType");
      let accountLabel = "";
      switch (accountType) {
        case "buyer":
          accountLabel = "خریدار";
          break;

        case "saller":
          accountLabel = "فروشنده";
          break;

        case "employe":
          accountLabel = "کارمند";
          break;

        case "bank":
          accountLabel = "بانک / صرافی";
          break;

        default:
          accountLabel = accountType;
          break;
      }
      return <div className="lowercase">{accountLabel}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          شماره تماس
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("phoneNumber")}</div>
    ),
  },

  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          آدرس
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ایمیل آدرس
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
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
      const [openSaller, setOpenSaller] = useState(false);
      return (
        <RegisterModal
          key={openSaller}
          data={payment}
          type="update"
          open={openSaller}
          onOpen={setOpenSaller}
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
                    // onClick={() => }
                    variant={"ghost"}
                    className={"w-full justify-end"}
                    asChild
                  >
                    <Link
                      href={
                        payment.accountType === "company"
                          ? "/customer/ledgar"
                          : `/customer/account/${payment._id}`
                      }
                    >
                      <span> جذیات</span>
                      <HiEye />
                    </Link>
                  </Button>
                </DropdownMenuItem>
                {payment.accountType === "company" ? (
                  ""
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(payment.id)}
                    >
                      <Button
                        onClick={() =>
                          setOpenSaller((openSaller) => !openSaller)
                        }
                        variant={"ghost"}
                        className={"w-full justify-end"}
                      >
                        <span>اصلاح کردن</span>
                        <HiPencil size={32} color="green" />
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button
                        onClick={() =>
                          setOpenDelete((openDelete) => !openDelete)
                        }
                        variant={"ghost"}
                        className={"w-full justify-end"}
                      >
                        <span>حذف</span>
                        <Trash2 size={32} strokeWidth={1.75} color={"red"} />
                      </Button>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </ConfirmDelete>
        </RegisterModal>
      );
    },
  },
];

export function DataTableRegister({ data, count }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function setFilter() {
    router.push(
      `${pathname}?${
        sorting.length
          ? "sort=" + sorting[0].id + "," + sorting[0].desc + "&"
          : ""
      }${
        columnFilters.length
          ? columnFilters
              .map((items) => `${items.id + "=" + items.value}`)
              .join("&") + "&"
          : ""
      }${"page=" + table.getState().pagination.pageIndex + "&limit=10"}`
    );
  }

  //  useEffect(() => {
  //     setFilter();
  //   }, [sorting ,getPaginationRowModel().pagination.pageIndex]);

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
            placeholder=" جستجو با اسم حساب....."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
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
          <RegisterModal open={open} onOpen={setOpen}>
            <DialogTrigger asChild>
              <Button>
                حساب جدید <HiUserPlus className="size-6" />
              </Button>
            </DialogTrigger>
          </RegisterModal>
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
                  {row?.getVisibleCells()?.map((cell) => (
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
                  className="h-24 text-phoneNumberer"
                >
                  نتیجه ای یافت نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-phoneNumberer justify-end space-x-2 py-4">
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
