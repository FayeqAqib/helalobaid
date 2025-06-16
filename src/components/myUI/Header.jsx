'use client'
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

const Header = () => {
  const { setTheme } = useTheme();
  return (
    <header className="w-full h-16 flex items-center justify-between px-4 bg-[var(--sidebar-border)] border-b-2 border-[--sidebar-foreground]">
      <SidebarTrigger />
      <Button variant="outline" size="icon" onClick={()=> setTheme((theme)=> theme=='light'?'dark':'light')}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  );
};

export default Header;
