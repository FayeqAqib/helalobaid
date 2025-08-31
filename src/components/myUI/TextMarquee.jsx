import { GetMarquee } from "@/services/marqueeService";
import React from "react";

const TextMarquee = async () => {
  const data = await GetMarquee();

  return (
    data.result?.[0]?.text && (
      <div className="w-full  py-3 overflow-hidden">
        <div
          className="text-red-500 text-lg px-8 flex whitespace-nowrap"
          style={{
            animation: "marquee-scroll 15s linear infinite",
          }}
        >
          {data.result?.[0]?.text}
        </div>
        <style>
          {`
          @keyframes marquee-scroll {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
        </style>
      </div>
    )
  );
};

export default TextMarquee;
