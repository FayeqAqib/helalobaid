import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Trash } from "lucide-react";
import monent from "moment-jalaali";

export function ModalTable({ data, onDelete }) {
  const x = "";
  x.length;
  return (
    <div className={"max-h-[170px] w-full overflow-y-auto"}>
      <Table>
        {data.length === 0 && (
          <TableCaption className="w-full text-center p-2">
            با افزودن یک محصول آغاز کنید.{" "}
          </TableCaption>
        )}
        <TableHeader className={"text-center"}>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>محصول</TableHead>
            <TableHead>تعداد</TableHead>
            <TableHead>واحد</TableHead>
            <TableHead>گدام</TableHead>
            <TableHead> اوسط تمام شد </TableHead>
            <TableHead> قیمت فروش</TableHead>
            <TableHead>مفاد</TableHead>
            <TableHead>مجموع</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, i) => (
            <TableRow key={i} className={"text-center"}>
              <TableCell>{data.length - i}</TableCell>
              <TableCell>{item.product?.name}</TableCell>
              <TableCell>{item.count}</TableCell>
              <TableCell>{item.unit.name}</TableCell>
              <TableCell>{item.depot.name}</TableCell>
              <TableCell>{formatCurrency(item.aveUnitAmount)}</TableCell>
              <TableCell>{formatCurrency(item.saleAmount)}</TableCell>
              <TableCell>{formatCurrency(item.profit)}</TableCell>
              <TableCell>
                {formatCurrency(item.saleAmount * item.count)}
              </TableCell>
              <TableCell>
                <Button onClick={() => onDelete(item.id)} variant="ghost">
                  <Trash className="text-red-400" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
