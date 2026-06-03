import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as classStorage, s as studentStorage, i as attendanceStorage, P as PageHeader, C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "./storage-BZHb4tET.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1dML0qAS.mjs";
import { b as calculateStudentRankings, d as getLowAttendanceAlerts, c as calculateAttendanceStats } from "./helpers-CMfmjl36.mjs";
import { R as ResponsiveContainer, P as PieChart, a as Pie, C as Cell, T as Tooltip, B as BarChart, b as CartesianGrid, X as XAxis, Y as YAxis, L as Legend, c as Bar } from "../_libs/recharts.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function AttendanceAnalyticsPage() {
  const [classes, setClasses] = reactExports.useState([]);
  const [selectedClass, setSelectedClass] = reactExports.useState("");
  const [students, setStudents] = reactExports.useState([]);
  const [analyticsData, setAnalyticsData] = reactExports.useState(null);
  const [rankings, setRankings] = reactExports.useState([]);
  const [lowAttendance, setLowAttendance] = reactExports.useState([]);
  reactExports.useEffect(() => {
    loadClasses();
    calculateGlobalAnalytics();
  }, []);
  reactExports.useEffect(() => {
    if (selectedClass) {
      loadStudents();
      calculateClassAnalytics();
    }
  }, [selectedClass]);
  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };
  const loadStudents = () => {
    if (selectedClass) {
      const classStudents = studentStorage.getByClass(selectedClass);
      setStudents(classStudents);
    }
  };
  const calculateGlobalAnalytics = () => {
    const allRecords = attendanceStorage.getAll();
    const allStudents = studentStorage.getAll();
    const allRankings = calculateStudentRankings();
    const lowAtt = getLowAttendanceAlerts(75);
    const totalRecords = allRecords.length;
    const presentCount = allRecords.filter((r) => r.status === "present").length;
    const absentCount = allRecords.filter((r) => r.status === "absent").length;
    setAnalyticsData({
      totalRecords,
      presentCount,
      absentCount,
      studentCount: allStudents.length,
      presentPercentage: totalRecords > 0 ? Math.round(presentCount / totalRecords * 100) : 0
    });
    setRankings(allRankings.slice(0, 10));
    setLowAttendance(lowAtt);
  };
  const calculateClassAnalytics = () => {
    if (!selectedClass) return;
    const records = attendanceStorage.getByClass(selectedClass);
    const classStudents = studentStorage.getByClass(selectedClass);
    const classRankings = calculateStudentRankings(selectedClass);
    setRankings(classRankings);
    const dailyData = {};
    records.forEach((record) => {
      if (!dailyData[record.date]) {
        dailyData[record.date] = {
          date: record.date,
          present: 0,
          absent: 0,
          leave: 0,
          late: 0
        };
      }
      dailyData[record.date][record.status]++;
    });
    const trendData = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
    const studentAttendance = classStudents.map((student) => {
      const stats = calculateAttendanceStats(student.id, selectedClass);
      return {
        name: student.rollNumber || student.name.substring(0, 3),
        percentage: stats.attendancePercentage
      };
    });
    setAnalyticsData({
      trendData,
      studentAttendance,
      totalRecords: records.length,
      presentCount: records.filter((r) => r.status === "present").length,
      absentCount: records.filter((r) => r.status === "absent").length,
      leaveCount: records.filter((r) => r.status === "leave").length,
      lateCount: records.filter((r) => r.status === "late").length
    });
  };
  const statusData = analyticsData ? [{
    name: "Present",
    value: analyticsData.presentCount,
    color: "#10b981"
  }, {
    name: "Absent",
    value: analyticsData.absentCount,
    color: "#ef4444"
  }, {
    name: "Leave",
    value: analyticsData.leaveCount || 0,
    color: "#f59e0b"
  }, {
    name: "Late",
    value: analyticsData.lateCount || 0,
    color: "#3b82f6"
  }] : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Attendance Analytics", description: "View detailed attendance analytics and insights." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Filter by Class" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedClass, onValueChange: setSelectedClass, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full md:w-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a class for detailed analytics" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", children: "All Classes" }),
            classes.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cls.id, children: cls.name }, cls.id))
          ] })
        ] }) })
      ] }),
      analyticsData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Total Records" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: analyticsData.totalRecords }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Present" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-green-600", children: analyticsData.presentCount }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Absent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-red-600", children: analyticsData.absentCount }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Attendance %" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-blue-600", children: analyticsData.presentPercentage || analyticsData.presentPercentage === 0 ? `${analyticsData.presentPercentage}%` : "N/A" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        statusData.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Attendance Status Distribution" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Overall attendance breakdown" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: statusData, cx: "50%", cy: "50%", labelLine: false, label: ({
              name,
              value
            }) => `${name}: ${value}`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: statusData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color }, `cell-${index}`)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {})
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Top 10 Students" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Ranked by attendance and achievements" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-[300px] overflow-y-auto", children: rankings.slice(0, 10).map((ranking) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-sm", children: [
                "#",
                ranking.rank
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: ranking.studentName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm", children: [
                ranking.attendancePercentage,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                ranking.totalPoints,
                " pts"
              ] })
            ] })
          ] }, ranking.studentId)) }) })
        ] })
      ] }),
      analyticsData?.trendData && analyticsData.trendData.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Attendance Trend" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Daily attendance over time" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 400, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: analyticsData.trendData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", angle: -45, textAnchor: "end", height: 80 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "present", stackId: "a", fill: "#10b981", name: "Present" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "absent", stackId: "a", fill: "#ef4444", name: "Absent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "leave", stackId: "a", fill: "#f59e0b", name: "Leave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "late", stackId: "a", fill: "#3b82f6", name: "Late" })
        ] }) }) })
      ] }),
      analyticsData?.studentAttendance && analyticsData.studentAttendance.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Student Attendance Percentage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Individual student attendance rates" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 400, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: analyticsData.studentAttendance, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { domain: [0, 100] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => `${value}%` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "percentage", fill: "#3b82f6", name: "Attendance %" })
        ] }) }) })
      ] }),
      lowAttendance.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-red-700 dark:text-red-300", children: "Low Attendance Alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "text-red-600 dark:text-red-400", children: [
            lowAttendance.length,
            " students below 75% attendance"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-[200px] overflow-y-auto", children: lowAttendance.map((alert) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm p-2 bg-white/50 dark:bg-black/20 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: alert.student.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
            alert.percentage,
            "%"
          ] })
        ] }, alert.student.id)) }) })
      ] })
    ] })
  ] });
}
export {
  AttendanceAnalyticsPage as component
};
