import { BookMarked } from "lucide-react";
import { MainNav } from "./main-nav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex flex-col border-r border-border bg-muted/40",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <BookMarked className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Class Companion</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MainNav />
      </div>
    </div>
  );
}
