import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as classStorage, P as PageHeader, C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription, s as studentStorage, i as attendanceStorage, j as achievementStorage } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1dML0qAS.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { L as Label } from "./label-BIiCNsEU.mjs";
import { c as calculateAttendanceStats, e as exportToCSV } from "./helpers-CMfmjl36.mjs";
import { F as FileText, D as Download, j as FileBraces } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/date-fns.mjs";
function ReportsPage() {
  const [classes, setClasses] = reactExports.useState([]);
  const [selectedClass, setSelectedClass] = reactExports.useState("");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [reportType, setReportType] = reactExports.useState("attendance");
  reactExports.useEffect(() => {
    loadClasses();
  }, []);
  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };
  const generateAttendanceReport = () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }
    const classData = classStorage.getById(selectedClass);
    const students = studentStorage.getByClass(selectedClass);
    const allRecords = attendanceStorage.getByClass(selectedClass);
    let filteredRecords = allRecords;
    if (dateFrom) filteredRecords = filteredRecords.filter((r) => r.date >= dateFrom);
    if (dateTo) filteredRecords = filteredRecords.filter((r) => r.date <= dateTo);
    const reportData = students.map((student) => {
      const records = filteredRecords.filter((r) => r.studentId === student.id);
      const stats = calculateAttendanceStats(student.id, selectedClass);
      return {
        "Roll Number": student.rollNumber,
        "Student Name": student.name,
        "Total Days": records.length,
        "Present": records.filter((r) => r.status === "present").length,
        "Absent": records.filter((r) => r.status === "absent").length,
        "Leave": records.filter((r) => r.status === "leave").length,
        "Late": records.filter((r) => r.status === "late").length,
        "Attendance %": stats.attendancePercentage
      };
    });
    exportToCSV(reportData, `attendance-report-${classData?.name}`);
  };
  const generateAchievementReport = () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }
    const classData = classStorage.getById(selectedClass);
    const students = studentStorage.getByClass(selectedClass);
    const achievements = achievementStorage.getAll().filter((a) => a.classId === selectedClass);
    const reportData = students.map((student) => {
      const studentAchievements = achievements.filter((a) => a.studentId === student.id);
      const totalPoints = studentAchievements.reduce((sum, a) => sum + a.points, 0);
      return {
        "Roll Number": student.rollNumber,
        "Student Name": student.name,
        "Total Achievements": studentAchievements.length,
        "Total Points": totalPoints,
        "Academic": studentAchievements.filter((a) => a.category === "academic").length,
        "Sports": studentAchievements.filter((a) => a.category === "sports").length,
        "Cultural": studentAchievements.filter((a) => a.category === "cultural").length
      };
    });
    exportToCSV(reportData, `achievement-report-${classData?.name}`);
  };
  const generateCombinedReport = () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }
    const classData = classStorage.getById(selectedClass);
    const students = studentStorage.getByClass(selectedClass);
    const achievements = achievementStorage.getAll().filter((a) => a.classId === selectedClass);
    const reportData = students.map((student) => {
      const stats = calculateAttendanceStats(student.id, selectedClass);
      const studentAchievements = achievements.filter((a) => a.studentId === student.id);
      const totalPoints = studentAchievements.reduce((sum, a) => sum + a.points, 0);
      return {
        "Roll Number": student.rollNumber,
        "Student Name": student.name,
        "Attendance %": stats.attendancePercentage,
        "Present": stats.presentDays,
        "Absent": stats.absentDays,
        "Achievements": studentAchievements.length,
        "Points": totalPoints
      };
    });
    exportToCSV(reportData, `combined-report-${classData?.name}`);
  };
  const downloadJSON = () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }
    const classData = classStorage.getById(selectedClass);
    const students = studentStorage.getByClass(selectedClass);
    const attendance = attendanceStorage.getByClass(selectedClass);
    const achievements = achievementStorage.getAll().filter((a) => a.classId === selectedClass);
    const data = {
      class: classData,
      students,
      attendance,
      achievements,
      exportDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `class-report-${classData?.name}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Reports", description: "Generate and view attendance reports in various formats." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Report Settings" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Select Class *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedClass, onValueChange: setSelectedClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a class" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: classes.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cls.id, children: cls.name }, cls.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "From Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: dateFrom, onChange: (e) => setDateFrom(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "To Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: dateTo, onChange: (e) => setDateTo(e.target.value) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }),
              "Attendance Report"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Detailed attendance statistics for the selected class" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Includes present, absent, leave, and late records for each student" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: generateAttendanceReport, disabled: !selectedClass, className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
              "Export as CSV"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }),
              "Achievement Report"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Student achievements and points breakdown" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Shows total achievements by category and points earned" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: generateAchievementReport, disabled: !selectedClass, className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
              "Export as CSV"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }),
              "Combined Report"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Comprehensive student performance summary" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Attendance and achievements data in a single report" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: generateCombinedReport, disabled: !selectedClass, className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
              "Export as CSV"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileBraces, { className: "h-5 w-5" }),
              "JSON Export"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Complete data in JSON format" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Export all class data including students, attendance, and achievements" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: downloadJSON, disabled: !selectedClass, className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
              "Export as JSON"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ReportsPage as component
};
