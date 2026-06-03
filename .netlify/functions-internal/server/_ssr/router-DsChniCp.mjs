import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useLocation } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { B as BookMarked, L as LayoutDashboard, a as BookOpen, U as Users, S as SquareCheckBig, C as ClipboardList, b as UsersRound, c as ChartColumn, d as CircleAlert, e as Calendar, G as Grid3x3, M as Megaphone, F as FileText, T as Trophy, f as Settings } from "../_libs/lucide-react.mjs";
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
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: BookOpen, label: "Manage Classes", to: "/classes" },
  { icon: Users, label: "Manage Students", to: "/students" },
  { icon: SquareCheckBig, label: "Mark Attendance", to: "/attendance/mark" },
  { icon: ClipboardList, label: "Attendance Records", to: "/attendance/records" },
  { icon: UsersRound, label: "Student Profiles", to: "/profiles" },
  { icon: ChartColumn, label: "Attendance Analytics", to: "/analytics" },
  { icon: CircleAlert, label: "Leave Management", to: "/leaves" },
  { icon: Calendar, label: "Holidays", to: "/holidays" },
  { icon: Grid3x3, label: "Seat Arrangement", to: "/seating" },
  { icon: Megaphone, label: "Announcements", to: "/announcements" },
  { icon: FileText, label: "Reports", to: "/reports" },
  { icon: Trophy, label: "Achievements", to: "/achievements" },
  { icon: Settings, label: "Settings", to: "/settings" }
];
function MainNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col space-y-1 px-2 py-4", children: navigationItems.map((item) => {
    const Icon = item.icon;
    const isActive = currentPath === item.to || currentPath.startsWith(item.to + "/");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.to,
        className: cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
        ]
      },
      item.to
    );
  }) });
}
function Sidebar({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col border-r border-border bg-muted/40",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookMarked, { className: "h-6 w-6 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-foreground", children: "Class Companion" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MainNav, {}) })
      ]
    }
  );
}
const appCss = "/assets/styles-D1CH-GbP.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$g = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sheet App" },
      { name: "description", content: "Sheet Generated Project" },
      { name: "author", content: "Sheet" },
      { property: "og:title", content: "Sheet App" },
      { property: "og:description", content: "Sheet Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Sheet" }
    ],
    links: [
      {
        rel: "icon",
        href: "data:;base64,"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$g.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { className: "w-64 hidden md:flex" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] }) });
}
const $$splitComponentImporter$f = () => import("./students-BqP3fpyd.mjs");
const Route$f = createFileRoute("/students")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./settings-DC566wgs.mjs");
const Route$e = createFileRoute("/settings")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./seating-Pqp-Wd4G.mjs");
const Route$d = createFileRoute("/seating")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./reports-BzLBUjUV.mjs");
const Route$c = createFileRoute("/reports")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./profiles-Drs1_wcQ.mjs");
const Route$b = createFileRoute("/profiles")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./leaves-CAKgoHt3.mjs");
const Route$a = createFileRoute("/leaves")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./holidays-C433PN32.mjs");
const Route$9 = createFileRoute("/holidays")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./dashboard-C5TkePqi.mjs");
const Route$8 = createFileRoute("/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./classes-BBEIrudO.mjs");
const Route$7 = createFileRoute("/classes")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./attendance-BFsOu0JM.mjs");
const Route$6 = createFileRoute("/attendance")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./announcements-DU8aV_6E.mjs");
const Route$5 = createFileRoute("/announcements")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./analytics-BoPT8axM.mjs");
const Route$4 = createFileRoute("/analytics")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./achievements-C4r0N3OD.mjs");
const Route$3 = createFileRoute("/achievements")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-C1RA0nDC.mjs");
const Route$2 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./records-Cm4NvJ5M.mjs");
const Route$1 = createFileRoute("/attendance/records")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./mark-DerHqp2T.mjs");
const Route = createFileRoute("/attendance/mark")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const StudentsRoute = Route$f.update({
  id: "/students",
  path: "/students",
  getParentRoute: () => Route$g
});
const SettingsRoute = Route$e.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$g
});
const SeatingRoute = Route$d.update({
  id: "/seating",
  path: "/seating",
  getParentRoute: () => Route$g
});
const ReportsRoute = Route$c.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => Route$g
});
const ProfilesRoute = Route$b.update({
  id: "/profiles",
  path: "/profiles",
  getParentRoute: () => Route$g
});
const LeavesRoute = Route$a.update({
  id: "/leaves",
  path: "/leaves",
  getParentRoute: () => Route$g
});
const HolidaysRoute = Route$9.update({
  id: "/holidays",
  path: "/holidays",
  getParentRoute: () => Route$g
});
const DashboardRoute = Route$8.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$g
});
const ClassesRoute = Route$7.update({
  id: "/classes",
  path: "/classes",
  getParentRoute: () => Route$g
});
const AttendanceRoute = Route$6.update({
  id: "/attendance",
  path: "/attendance",
  getParentRoute: () => Route$g
});
const AnnouncementsRoute = Route$5.update({
  id: "/announcements",
  path: "/announcements",
  getParentRoute: () => Route$g
});
const AnalyticsRoute = Route$4.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => Route$g
});
const AchievementsRoute = Route$3.update({
  id: "/achievements",
  path: "/achievements",
  getParentRoute: () => Route$g
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$g
});
const AttendanceRecordsRoute = Route$1.update({
  id: "/records",
  path: "/records",
  getParentRoute: () => AttendanceRoute
});
const AttendanceMarkRoute = Route.update({
  id: "/mark",
  path: "/mark",
  getParentRoute: () => AttendanceRoute
});
const AttendanceRouteChildren = {
  AttendanceMarkRoute,
  AttendanceRecordsRoute
};
const AttendanceRouteWithChildren = AttendanceRoute._addFileChildren(
  AttendanceRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AchievementsRoute,
  AnalyticsRoute,
  AnnouncementsRoute,
  AttendanceRoute: AttendanceRouteWithChildren,
  ClassesRoute,
  DashboardRoute,
  HolidaysRoute,
  LeavesRoute,
  ProfilesRoute,
  ReportsRoute,
  SeatingRoute,
  SettingsRoute,
  StudentsRoute
};
const routeTree = Route$g._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  cn as c,
  router as r
};
