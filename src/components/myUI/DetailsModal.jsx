import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import moment from "moment-jalaali";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useRef } from "react";

export function DetailsModal({ data = {}, open, onChange, children }) {
  const imgRef = useRef(null);
  const handleDownload = () => {
    window.open(data.image, "_blank");
  };
  const handleClick = () => {
    if (imgRef.current.requestFullscreen) {
      imgRef.current.requestFullscreen();
    } else if (imgRef.current.webkitRequestFullscreen) {
      // برای Safari
      imgRef.current.webkitRequestFullscreen();
    } else if (imgRef.current.msRequestFullscreen) {
      // برای IE/Edge
      imgRef.current.msRequestFullscreen();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onChange}>
      {children}
      <DialogContent className="flex flex-col ">
        <DialogHeader className={"flex flex-row gap-6 flex-1 items-center"}>
          <DialogTitle className={"text-right text-2xl"}>
            {data.name}
          </DialogTitle>
          {data.sendDate && (
            <DialogTitle className={"text-right text-md"}>
              {moment(data.sendDate).format("jYYYY/jMM/jDD")}
            </DialogTitle>
          )}
          <DialogTitle className={"text-right text-md"}>
            {moment(data.date).format("jYYYY/jMM/jDD")}
          </DialogTitle>
        </DialogHeader>
        {data?.image && (
          <>
            <div
              className="relative flex-6 aspect-video rounded-sm overflow-hidden"
              onClick={handleClick}
            >
              <Image
                ref={imgRef}
                alt="image"
                src={data.image}
                fill={true}
                style={{
                  objectFit: "cover",
                  position: "absolute",
                }}
              />
            </div>
            <Button onClick={handleDownload}> بازکردن فایل</Button>
          </>
        )}
        <div className="space-y-1 mt-5 max-h-96 overflow-auto">
          {data?.accountType && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>نوع حساب</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {data.accountType}
                </DialogDescription>
              </div>

              <Separator />
            </>
          )}
          {data?.phoneNumber && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>شماره تماس</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {data.phoneNumber}
                </DialogDescription>
              </div>

              <Separator />
            </>
          )}
          {data?.email && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}> ایمیل آدرس </DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {data.email}
                </DialogDescription>
              </div>

              <Separator />
            </>
          )}
          {data?.address && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>آدرس</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {data.address}
                </DialogDescription>
              </div>

              <Separator />
            </>
          )}
          {data?.from && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>انتقال از</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {data.from}
                </DialogDescription>
              </div>

              <Separator />
            </>
          )}
          {data?.to && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>انتقال به</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {data.to}
                </DialogDescription>
              </div>

              <Separator />
            </>
          )}
          {data?.cashAmount && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>رسید</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {formatCurrency(data.cashAmount)}
                </DialogDescription>
              </div>

              <Separator />
            </>
          )}
          {data?.borrow ? (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>طلب</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {formatCurrency(data.borrow)}
                </DialogDescription>
              </div>
              <Separator />
            </>
          ) : (
            ""
          )}
          {data?.lend ? (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>باقی</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {formatCurrency(data.lend)}
                </DialogDescription>
              </div>
              <Separator />
            </>
          ) : (
            ""
          )}
          {data?.balance ? (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>بیلانس</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {formatCurrency(data.balance)}
                </DialogDescription>
              </div>
              <Separator />
            </>
          ) : (
            ""
          )}
          {data?.lendAmount && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>باقی</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {formatCurrency(data.lendAmount)}
                </DialogDescription>
              </div>
              <Separator />
            </>
          )}
          {data?.totalAmount && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>مجموع پول</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {formatCurrency(data.totalAmount)}
                </DialogDescription>
              </div>
              <Separator />
            </>
          )}
          {data?.amount && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>مقدار پول</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {formatCurrency(data.amount)}
                </DialogDescription>
              </div>
              <Separator />
            </>
          )}
          {data?.cent && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>فیصدی</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {data.cent}٪
                </DialogDescription>
              </div>
              <Separator />
            </>
          )}
          {data?.metuAmount && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>مقدار METU</DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {formatNumber(data.metuAmount)}
                </DialogDescription>
              </div>
              <Separator />
            </>
          )}
          {data?.status && (
            <>
              <div className="flex gap-6 items-center justify-between pe-4">
                <DialogTitle className={"text-right"}>حالت </DialogTitle>
                <DialogDescription className={"text-lg"}>
                  {data.status}
                </DialogDescription>
              </div>
              <Separator />
            </>
          )}
          {data?.buyerMessage && (
            <div className="flex flex-col gap-3 justify-center ">
              <DialogTitle className={"text-right"}>نظر خریدار</DialogTitle>
              <DialogDescription className={"text-lg"}>
                {data?.buyerMessage}
              </DialogDescription>
            </div>
          )}
          {data?.items&&{
            
          }}
          <div className="flex flex-col gap-3 justify-center ">
            <DialogTitle className={"text-right"}>تفصیلات</DialogTitle>
            <DialogDescription className={"text-lg"}>
              {data?.details}
            </DialogDescription>
          </div>
        </div>

        <div className="flex flex-2 justify-end gap-2.5">
          <DialogClose asChild>
            <Button type="button">بازگشت</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
