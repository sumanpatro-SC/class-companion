import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as classStorage, s as studentStorage, i as attendanceStorage, P as PageHeader, C as Card, a as CardContent, b as CardHeader, d as CardTitle, e as CardDescription } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1dML0qAS.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CprBhaPa.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { L as Label } from "./label-BIiCNsEU.mjs";
import { i as isHoliday, f as formatDateString, g as generateId } from "./helpers-CMfmjl36.mjs";
import { l as Check, X, m as Clock } from "../_libs/lucide-react.mjs";
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
function MarkAttendancePage() {
  const [classes, setClasses] = reactExports.useState([]);
  const [selectedClass, setSelectedClass] = reactExports.useState("");
  const [selectedDate, setSelectedDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [students, setStudents] = reactExports.useState([]);
  const [attendance, setAttendance] = reactExports.useState({});
  const [remarks, setRemarks] = reactExports.useState({});
  const [isLoading, setIsLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadClasses();
  }, []);
  reactExports.useEffect(() => {
    if (selectedClass) {
      loadStudents();
      loadAttendance();
    }
  }, [selectedClass, selectedDate]);
  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };
  const loadStudents = () => {
    if (selectedClass) {
      const classStudents = studentStorage.getByClass(selectedClass);
      setStudents(classStudents);
      const attendanceMap = {};
      classStudents.forEach((student) => {
        attendanceMap[student.id] = "present";
      });
      setAttendance(attendanceMap);
    }
  };
  const loadAttendance = () => {
    if (selectedClass) {
      const existingRecords = attendanceStorage.getByClass(selectedClass, selectedDate);
      const attendanceMap = {};
      const remarksMap = {};
      existingRecords.forEach((record) => {
        attendanceMap[record.studentId] = record.status;
        if (record.remarks) {
          remarksMap[record.studentId] = record.remarks;
        }
      });
      setAttendance(attendanceMap);
      setRemarks(remarksMap);
    }
  };
  const handleSave = async () => {
    if (!selectedClass || !selectedDate) {
      alert("Please select class and date");
      return;
    }
    const holiday2 = isHoliday(selectedDate);
    if (holiday2) {
      alert(`This date is marked as a holiday: ${holiday2.name}`);
      return;
    }
    setIsLoading(true);
    try {
      const existing = attendanceStorage.getByClass(selectedClass, selectedDate);
      existing.forEach((record) => {
        attendanceStorage.delete(record.id);
      });
      const newRecords = Object.entries(attendance).map(([studentId, status]) => ({
        id: generateId(),
        studentId,
        classId: selectedClass,
        date: selectedDate,
        status,
        remarks: remarks[studentId] || void 0,
        markedAt: (/* @__PURE__ */ new Date()).toISOString(),
        markedBy: "Admin"
      }));
      attendanceStorage.addBulk(newRecords);
      alert("Attendance marked successfully!");
      loadAttendance();
    } catch (error) {
      alert("Error saving attendance: " + error);
    } finally {
      setIsLoading(false);
    }
  };
  const markAll = (status) => {
    const newAttendance = {};
    students.forEach((student) => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };
  const statusColors = {
    present: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
    absent: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
    leave: "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300",
    late: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
  };
  const holiday = isHoliday(selectedDate);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Mark Attendance", description: "Mark attendance for students." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      holiday && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-yellow-800 dark:text-yellow-200", children: [
        "⚠️ ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: holiday.name }),
        " is marked as a holiday. Attendance cannot be marked for this date."
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Select Class & Date" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedClass, onValueChange: setSelectedClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a class" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: classes.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cls.id, children: cls.name }, cls.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: selectedDate, onChange: (e) => setSelectedDate(e.target.value), disabled: holiday !== null })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => markAll("present"), className: "flex-1", children: "Mark All Present" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => markAll("absent"), className: "flex-1", children: "Mark All Absent" })
          ] })
        ] }) })
      ] }),
      students.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
            "Attendance - ",
            classes.find((c) => c.id === selectedClass)?.name || "",
            " - ",
            formatDateString(selectedDate)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            students.length,
            " students total"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Roll #" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Remarks" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: students.map((student) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: student.rollNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: student.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: attendance[student.id] || "present", onValueChange: (value) => setAttendance({
                ...attendance,
                [student.id]: value
              }), disabled: holiday !== null, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: `w-32 ${statusColors[attendance[student.id]] || statusColors.present}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "present", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
                    " Present"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "absent", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
                    " Absent"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "leave", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
                    " Leave"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "late", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
                    " Late"
                  ] }) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Remarks", value: remarks[student.id] || "", onChange: (e) => setRemarks({
                ...remarks,
                [student.id]: e.target.value
              }), disabled: holiday !== null, className: "w-48" }) })
            ] }, student.id)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => loadAttendance(), children: "Reset" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, disabled: isLoading || holiday !== null, children: isLoading ? "Saving..." : "Save Attendance" })
          ] })
        ] })
      ] }),
      !selectedClass && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 text-center text-muted-foreground", children: "Select a class to view students and mark attendance" }) })
    ] })
  ] });
}
export {
  MarkAttendancePage as component
};
