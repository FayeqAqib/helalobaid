import { Loader2, Loader2Icon } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="w-full  h-[95vh] flex items-center justify-center">
      <Loader2Icon className="animate-spin" />
    </div>
  );
}
