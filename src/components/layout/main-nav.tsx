import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CheckSquare,
  BarChart3,
  FileText,
  Calendar,
  AlertCircle,
  Users2,
  Grid3x3,
  Megaphone,
  Trophy,
  Settings,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: BookOpen, label: "Manage Classes", to: "/classes" },
  { icon: Users, label: "Manage Students", to: "/students" },
  { icon: CheckSquare, label: "Mark Attendance", to: "/attendance/mark" },
  { icon: ClipboardList, label: "Attendance Records", to: "/attendance/records" },
  { icon: Users2, label: "Student Profiles", to: "/profiles" },
  { icon: BarChart3, label: "Attendance Analytics", to: "/analytics" },
  { icon: AlertCircle, label: "Leave Management", to: "/leaves" },
  { icon: Calendar, label: "Holidays", to: "/holidays" },
  { icon: Grid3x3, label: "Seat Arrangement", to: "/seating" },
  { icon: Megaphone, label: "Announcements", to: "/announcements" },
  { icon: FileText, label: "Reports", to: "/reports" },
  { icon: Trophy, label: "Achievements", to: "/achievements" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export function MainNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="flex flex-col space-y-1 px-2 py-4">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.to || currentPath.startsWith(item.to + "/");

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
