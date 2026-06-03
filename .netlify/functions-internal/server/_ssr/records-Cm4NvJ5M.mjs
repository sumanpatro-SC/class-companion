import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as classStorage, s as studentStorage, i as attendanceStorage, P as PageHeader, C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "./storage-BZHb4tET.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1dML0qAS.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CprBhaPa.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { f as formatDateString, e as exportToCSV } from "./helpers-CMfmjl36.mjs";
import { k as Funnel, D as Download } from "../_libs/lucide-react.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_libs/date-fns.mjs";
function AttendanceRecordsPage() {
  const [classes, setClasses] = reactExports.useState([]);
  const [students, setStudents] = reactExports.useState([]);
  const [selectedClass, setSelectedClass] = reactExports.useState("");
  const [selectedStudent, setSelectedStudent] = reactExports.useState("");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [records, setRecords] = reactExports.useState([]);
  reactExports.useEffect(() => {
    loadClasses();
  }, []);
  reactExports.useEffect(() => {
    if (selectedClass) {
      loadStudents();
    } else {
      setStudents([]);
    }
  }, [selectedClass]);
  reactExports.useEffect(() => {
    applyFilters();
  }, [selectedClass, selectedStudent, dateFrom, dateTo]);
  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };
  const loadStudents = () => {
    if (selectedClass) {
      const classStudents = studentStorage.getByClass(selectedClass);
      setStudents(classStudents);
    }
  };
  const applyFilters = () => {
    let allRecords = attendanceStorage.getAll();
    if (selectedClass) {
      allRecords = allRecords.filter((r) => r.classId === selectedClass);
    }
    if (selectedStudent) {
      allRecords = allRecords.filter((r) => r.studentId === selectedStudent);
    }
    if (dateFrom) {
      allRecords = allRecords.filter((r) => r.date >= dateFrom);
    }
    if (dateTo) {
      allRecords = allRecords.filter((r) => r.date <= dateTo);
    }
    allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecords(allRecords);
  };
  const getClassName = (classId) => {
    return classes.find((c) => c.id === classId)?.name || "Unknown";
  };
  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) {
      const allStudents = studentStorage.getAll();
      return allStudents.find((s) => s.id === studentId)?.name || "Unknown";
    }
    return student.name;
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
      case "absent":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
      case "leave":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
      case "late":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100";
      default:
        return "";
    }
  };
  const handleExport = () => {
    if (records.length === 0) {
      alert("No records to export");
      return;
    }
    const exportData = records.map((r) => ({
      Date: formatDateString(r.date),
      Student: getStudentName(r.studentId),
      Class: getClassName(r.classId),
      Status: r.status.toUpperCase(),
      Remarks: r.remarks || "",
      "Marked At": new Date(r.markedAt).toLocaleString()
    }));
    exportToCSV(exportData, "attendance-records");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Attendance Records", description: "View attendance records and history." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-5 w-5" }),
          "Filters"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedClass, onValueChange: setSelectedClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Classes" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", children: "All Classes" }),
                classes.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cls.id, children: cls.name }, cls.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Student" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedStudent, onValueChange: setSelectedStudent, disabled: !selectedClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Students" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", children: "All Students" }),
                students.map((student) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: student.id, children: student.name }, student.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "From Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: dateFrom, onChange: (e) => setDateFrom(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "To Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: dateTo, onChange: (e) => setDateTo(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
            setSelectedClass("");
            setSelectedStudent("");
            setDateFrom("");
            setDateTo("");
          }, className: "w-full", children: "Reset" }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Attendance Records" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
              "Total records: ",
              records.length
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleExport, disabled: records.length === 0, className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
            "Export CSV"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: records.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-muted-foreground py-8", children: "No attendance records found" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Student" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Remarks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Marked At" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: records.map((record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDateString(record.date) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStudentName(record.studentId) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getClassName(record.classId) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.status)}`, children: record.status.toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: record.remarks || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: new Date(record.markedAt).toLocaleString() })
          ] }, record.id)) })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  AttendanceRecordsPage as component
};
