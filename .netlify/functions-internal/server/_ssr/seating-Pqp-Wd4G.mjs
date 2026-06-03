import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as classStorage, s as studentStorage, h as seatArrangementStorage, P as PageHeader, C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1dML0qAS.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { L as Label } from "./label-BIiCNsEU.mjs";
import { g as generateId } from "./helpers-CMfmjl36.mjs";
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
function SeatArrangementPage() {
  const [classes, setClasses] = reactExports.useState([]);
  const [selectedClass, setSelectedClass] = reactExports.useState("");
  const [students, setStudents] = reactExports.useState([]);
  const [rows, setRows] = reactExports.useState(5);
  const [cols, setCols] = reactExports.useState(6);
  const [seatMap, setSeatMap] = reactExports.useState({});
  reactExports.useEffect(() => {
    loadClasses();
  }, []);
  reactExports.useEffect(() => {
    if (selectedClass) {
      loadStudents();
      loadSeating();
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
  const loadSeating = () => {
    if (selectedClass) {
      const arrangements = seatArrangementStorage.getByClass(selectedClass);
      const map = {};
      arrangements.forEach((arr) => {
        map[`${arr.row}-${arr.column}`] = arr;
      });
      setSeatMap(map);
    }
  };
  const handleSeatClick = (row, col) => {
    const seatKey = `${row}-${col}`;
    const availableStudents = students.filter((s) => !Object.values(seatMap).some((seat) => seat.studentId === s.id));
    if (!availableStudents.length) {
      alert("All students are already seated");
      return;
    }
    if (!seatMap[seatKey]) {
      const student = availableStudents[0];
      const arrangement = {
        id: generateId(),
        classId: selectedClass,
        studentId: student.id,
        row,
        column: col,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      seatArrangementStorage.add(arrangement);
      setSeatMap({
        ...seatMap,
        [seatKey]: arrangement
      });
    }
  };
  const handleClearSeat = (row, col) => {
    const seatKey = `${row}-${col}`;
    const arrangement = seatMap[seatKey];
    if (arrangement) {
      seatArrangementStorage.delete(arrangement.id);
      const newMap = {
        ...seatMap
      };
      delete newMap[seatKey];
      setSeatMap(newMap);
    }
  };
  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all seats?")) {
      Object.values(seatMap).forEach((arr) => {
        seatArrangementStorage.delete(arr.id);
      });
      setSeatMap({});
    }
  };
  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.rollNumber || student.name.substring(0, 6) : "?";
  };
  const getSeatedStudents = () => {
    return Object.values(seatMap).length;
  };
  const getAvailableStudents = () => {
    return students.filter((s) => !Object.values(seatMap).some((seat) => seat.studentId === s.id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Seat Arrangement", description: "Manage student seating arrangements." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Classroom Configuration" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Select Class" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedClass, onValueChange: setSelectedClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a class" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: classes.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cls.id, children: cls.name }, cls.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Number of Rows" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: rows, onChange: (e) => setRows(parseInt(e.target.value) || 1), min: "1", max: "10" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Number of Columns" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: cols, onChange: (e) => setCols(parseInt(e.target.value) || 1), min: "1", max: "10" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: handleClearAll, className: "w-full", children: "Clear All Seats" }) })
          ] }),
          selectedClass && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              "Seated: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600", children: getSeatedStudents() }),
              " / ",
              students.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Capacity: ",
              rows * cols
            ] })
          ] })
        ] })
      ] }),
      selectedClass && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Classroom Layout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Click on seats to assign students" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-block border-4 border-yellow-600 rounded-lg p-4 bg-yellow-100 dark:bg-yellow-900/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 text-center text-sm font-semibold text-yellow-800 dark:text-yellow-200", children: "BOARD" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Array.from({
              length: rows
            }).map((_, row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: Array.from({
              length: cols
            }).map((_2, col) => {
              const seatKey = `${row}-${col}`;
              const arrangement = seatMap[seatKey];
              return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => arrangement ? handleClearSeat(row, col) : handleSeatClick(row, col), className: `w-16 h-16 rounded border-2 font-medium text-sm flex items-center justify-center cursor-pointer transition-all ${arrangement ? "bg-blue-500 text-white border-blue-600 hover:bg-red-500" : "bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"}`, title: arrangement ? `Click to remove ${getStudentName(arrangement.studentId)}` : "Click to assign", children: arrangement ? getStudentName(arrangement.studentId) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "Empty" }) }, `${row}-${col}`);
            }) }, row)) })
          ] }) }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Unassigned Students" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
              getAvailableStudents().length,
              " remaining"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-[400px] overflow-y-auto", children: getAvailableStudents().length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "All students seated!" }) : getAvailableStudents().map((student) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 bg-gray-100 dark:bg-slate-800 rounded text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: student.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: student.rollNumber })
          ] }, student.id)) }) })
        ] }) })
      ] }),
      !selectedClass && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 text-center text-muted-foreground", children: "Select a class to arrange student seating" }) })
    ] })
  ] });
}
export {
  SeatArrangementPage as component
};
