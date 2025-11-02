"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

// const baseURL = ;

const Bill = ({ bill }) => {
  const [isPending, startTransition] = useTransition();
  const [selectedHeaderFile, setSelectedHeaderFile] = useState(null);
  const [previewHeaderUrl, setPreviewHeaderUrl] = useState(bill?.header);
  const [selectedFooterFile, setSelectedFooterFile] = useState(null);
  const [previewFooterUrl, setPreviewFooterUrl] = useState(bill?.footer);
  const [isNewHeader, setIsNewHeader] = useState(false);
  const [isNewFooter, setIsNewFooter] = useState(false);
  const headerRef = useRef();
  const footerRef = useRef();

  const handleHeaderFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedHeaderFile(file);
    setIsNewHeader(true);
    setPreviewHeaderUrl(URL.createObjectURL(file));
  };
  const handleFooterFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFooterFile(file);
    setIsNewFooter(true);
    setPreviewFooterUrl(URL.createObjectURL(file));
  };

  function handleUpdateBill() {
    const formData = new FormData();
    formData.append("header", selectedHeaderFile);
    formData.append("footer", selectedFooterFile);
    formData.append("isNewHeader", isNewHeader);
    formData.append("isNewFooter", isNewFooter);
    formData.append("oldHeader", bill?.header);
    formData.append("oldFooter", bill?.footer);
    formData.append("_id", bill?._id);

    startTransition(async () => {
      try {
        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/billHeaderAndFooter`,
          formData
        );

        if (result.status === 200) {
          toast.success("با موفقیت آپدیت شد");
        } else {
          toast.error("در آپدیت مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید");
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
  return (
    <Card>
      <CardContent className={"flex flex-col md:flex-row gap-5 flex-1"}>
        <div
          className=" relative min-h-[200px] min-w-[50%] aspect-video flex-1 overflow-hidden border-2 rounded-2xl"
          onClick={() => headerRef.current.click()}
        >
          <Image
            src={previewHeaderUrl}
            alt="Header"
            fill
            className="object-cover size-full absolute"
          />
          <input
            accept="amage/*"
            className="hidden"
            ref={headerRef}
            onChange={handleHeaderFileChange}
            type="file"
          />
        </div>
        <div
          className=" relative aspect-video flex-1 overflow-hidden border-2 rounded-2xl"
          onClick={() => footerRef.current.click()}
        >
          <Image
            src={previewFooterUrl}
            fill
            alt="Header"
            className="object-cover size-full absolute"
          />
          <input
            accept="amage/*"
            className="hidden"
            ref={footerRef}
            type="file"
            onChange={handleFooterFileChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className={"w-full"}
          onClick={handleUpdateBill}
          disabled={isPending}
        >
          {isPending ? <Loader2Icon /> : "آپدیت"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Bill;
