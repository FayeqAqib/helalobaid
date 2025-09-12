import React from "react";
import AccountTabs from "@/components/features/register/registerTabs/Tabs";

export default async function page({ searchParams }) {
  const filter = await searchParams;

  return <AccountTabs filter={filter} />;
}
