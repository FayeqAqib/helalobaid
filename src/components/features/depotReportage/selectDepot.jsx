"use client";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const SelectDepot = () => {
  const [depot, setDepot] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    router.push(
      pathname + "?" + createQueryString("depot", depot.split("_")[1])
    );
  }, [depot]);
  return (
    <div className="flex flex-row gap-7 w-full mb-5">
      <h2 className={"text-2xl font-bold"}> گدام</h2>
      <AutoCompleteV2
        dataType="depot"
        value={depot}
        onChange={setDepot}
        label=" گدام را انتخاب کنید.."
      />
    </div>
  );
};

export default SelectDepot;
