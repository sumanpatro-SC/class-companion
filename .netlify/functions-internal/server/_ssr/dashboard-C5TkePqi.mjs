import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as classStorage, s as studentStorage, i as attendanceStorage, j as achievementStorage, P as PageHeader, C as Card, b as CardHeader, d as CardTitle, e as CardDescription, a as CardContent } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { b as calculateStudentRankings, d as getLowAttendanceAlerts } from "./helpers-CMfmjl36.mjs";
import { a as BookOpen, U as Users, S as SquareCheckBig, T as Trophy, d as CircleAlert, c as ChartColumn } from "../_libs/lucide-react.mjs";
import "./router-DsChniCp.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/date-fns.mjs";
function DashboardPage() {
  const [stats, setStats] = reactExports.useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAttendanceRecords: 0,
    totalAchievements: 0,
    topRankings: [],
    lowAttendanceCount: 0
  });
  reactExports.useEffect(() => {
    const classes = classStorage.getAll();
    const students = studentStorage.getAll();
    const attendance = attendanceStorage.getAll();
    const achievements = achievementStorage.getAll();
    const rankings = calculateStudentRankings();
    const lowAttendance = getLowAttendanceAlerts(75);
    setStats({
      totalClasses: classes.length,
      totalStudents: students.length,
      totalAttendanceRecords: attendance.length,
      totalAchievements: achievements.length,
      topRankings: rankings.slice(0, 5),
      lowAttendanceCount: lowAttendance.length
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Dashboard", description: "Welcome back! Here's an overview of your school's attendance and performance." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Classes", value: stats.totalClasses, icon: BookOpen, color: "text-blue-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Students", value: stats.totalStudents, icon: Users, color: "text-green-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Attendance Records", value: stats.totalAttendanceRecords, icon: SquareCheckBig, color: "text-purple-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Achievements", value: stats.totalAchievements, icon: Trophy, color: "text-yellow-500" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        stats.lowAttendanceCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-red-600 dark:text-red-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5" }),
              "Low Attendance Alert"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "text-red-600/70 dark:text-red-400/70", children: [
              stats.lowAttendanceCount,
              " students need attention"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/analytics", children: "View Details" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-5 w-5" }),
              "Top Rankings"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Best performing students" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: stats.topRankings.length > 0 ? stats.topRankings.map((ranking) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: ranking.studentName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Rank #",
                ranking.rank
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm", children: [
                ranking.attendancePercentage,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                ranking.totalPoints,
                " points"
              ] })
            ] })
          ] }, ranking.studentId)) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No data yet" }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Quick Actions" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/attendance/mark", children: "Mark Attendance" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/students", children: "Add Student" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/classes", children: "Add Class" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/announcements", children: "New Announcement" }) })
        ] }) })
      ] })
    ] })
  ] });
}
function StatCard({
  title,
  value,
  icon: Icon,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-8 w-8 ${color} opacity-70` })
    ] }) })
  ] });
}
export {
  DashboardPage as component
};
