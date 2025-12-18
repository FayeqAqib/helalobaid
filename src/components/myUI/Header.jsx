// "use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const Header = ({ width }) => {
  const { setTheme } = useTheme();
  return (
    <header
      className={cn(
        "w-full h-16 z-100 fixed flex items-center backdrop-blur-sm justify-between px-4 bg-[var(--sidebar)]/20 border-b-2 border-[--sidebar-foreground] transition-[width] duration-200 ease-linear",
        width
      )}
    >
      <SidebarTrigger />

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          setTheme((theme) => (theme == "light" ? "dark" : "light"))
        }
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  );
};

export default Header;
