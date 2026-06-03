import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as leaveStorage, P as PageHeader, C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription, s as studentStorage, c as classStorage } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CprBhaPa.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as cn } from "./router-DsChniCp.mjs";
import { f as formatDateString } from "./helpers-CMfmjl36.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/clsx.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/date-fns.mjs";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
function LeaveManagementPage() {
  const [leaves, setLeaves] = reactExports.useState([]);
  const [filter, setFilter] = reactExports.useState("all");
  reactExports.useEffect(() => {
    loadLeaves();
  }, []);
  const loadLeaves = () => {
    let allLeaves = leaveStorage.getAll();
    allLeaves.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    setLeaves(allLeaves);
  };
  const filteredLeaves = leaves.filter((leave) => {
    if (filter === "all") return true;
    return leave.status === filter;
  });
  const getStudentName = (studentId) => {
    const student = studentStorage.getById(studentId);
    return student?.name || "Unknown";
  };
  const getClassName = (classId) => {
    const classData = classStorage.getById(classId);
    return classData?.name || "Unknown";
  };
  const handleApprove = (id) => {
    leaveStorage.update(id, {
      status: "approved",
      approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
      approvedBy: "Admin"
    });
    loadLeaves();
  };
  const handleReject = (id) => {
    leaveStorage.update(id, {
      status: "rejected",
      approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
      approvedBy: "Admin"
    });
    loadLeaves();
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Pending" });
      case "approved":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-600", children: "Approved" });
      case "rejected":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "Rejected" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: "Unknown" });
    }
  };
  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Leave Management", description: "Manage student leave requests and approvals." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Total Requests" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: stats.total }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Pending" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-yellow-600", children: stats.pending }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Approved" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-green-600", children: stats.approved }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Rejected" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-red-600", children: stats.rejected }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Filter" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["all", "pending", "approved", "rejected"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: filter === f ? "default" : "outline", onClick: () => setFilter(f), children: f.charAt(0).toUpperCase() + f.slice(1) }, f)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Leave Requests" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            "Showing ",
            filteredLeaves.length,
            " requests"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: filteredLeaves.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-muted-foreground py-8", children: "No leave requests found" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Student" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "From Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "To Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredLeaves.map((leave) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: getStudentName(leave.studentId) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getClassName(leave.classId) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDateString(leave.startDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDateString(leave.endDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: leave.reason }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStatusBadge(leave.status) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2", children: leave.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => handleApprove(leave.id), className: "text-green-600", children: "Approve" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => handleReject(leave.id), className: "text-red-600", children: "Reject" })
            ] }) }) })
          ] }, leave.id)) })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  LeaveManagementPage as component
};
