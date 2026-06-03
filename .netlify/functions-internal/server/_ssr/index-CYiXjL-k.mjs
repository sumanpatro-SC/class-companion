import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-9AjDR6qP.mjs";
import "../_libs/seroval.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const fetchSheetCsv = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  sheetId: stringType().min(10),
  gid: stringType().default("0")
})).handler(createSsrRpc("4a047136e1661a55d862782880f1d9d7e75e17a0bd7db5d1f054dd839da434cc"));
const LS_KEYS = {
  sheet: "att.sheet.v1",
  students: "att.students.v1",
  records: "att.records.v1"
};
function load(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
}
function extractSheetId(url) {
  const m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : null;
}
function extractGid(url) {
  const m = url.match(/[#&?]gid=(\d+)/);
  return m ? m[1] : "0";
}
function parseCSV(text) {
  if (text.charCodeAt(0) === 65279) text = text.slice(1);
  const rows = [];
  let cur = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        cur.push(field);
        field = "";
      } else if (c === "\n") {
        cur.push(field);
        rows.push(cur);
        cur = [];
        field = "";
      } else if (c === "\r") ;
      else field += c;
    }
  }
  if (field.length || cur.length) {
    cur.push(field);
    rows.push(cur);
  }
  return rows.filter((r) => r.some((cell) => cell.trim().length));
}
function studentsFromCSV(rows) {
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const hasHeader = header.some((h) => /roll|name|class|student|grade|section/.test(h));
  const ncols = Math.max(...rows.map((r) => r.length));
  let rollIdx = -1, nameIdx = -1, classIdx = -1;
  if (hasHeader) {
    rollIdx = header.findIndex((h) => /roll|^id$|^no\.?$|number/.test(h));
    nameIdx = header.findIndex((h) => /name|student/.test(h));
    classIdx = header.findIndex((h) => /class|grade|section/.test(h));
  }
  if (nameIdx === -1) {
    if (ncols === 1) {
      nameIdx = 0;
    } else if (ncols === 2) {
      rollIdx = 0;
      nameIdx = 1;
    } else {
      rollIdx = 0;
      nameIdx = 1;
      classIdx = 2;
    }
  }
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  dataRows.forEach((r, i) => {
    const rawRoll = rollIdx >= 0 ? (r[rollIdx] ?? "").trim() : "";
    const name = (r[nameIdx] ?? "").trim();
    const klass = classIdx >= 0 ? (r[classIdx] ?? "").trim() : "";
    if (!name) return;
    const roll = rawRoll || String(i + 1);
    const id = `${roll}::${name}`.toLowerCase();
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ id, roll, name, klass });
  });
  return out;
}
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function daysInMonth(year, month0) {
  return new Date(year, month0 + 1, 0).getDate();
}
function isoDate(year, month0, day) {
  const m = String(month0 + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}
function todayParts() {
  const d = /* @__PURE__ */ new Date();
  return { year: d.getFullYear(), month0: d.getMonth(), day: d.getDate() };
}
function useToast() {
  const [toast, setToast] = reactExports.useState(null);
  const timerRef = reactExports.useRef(null);
  function show(msg, kind = "info") {
    setToast({ msg, kind });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2400);
  }
  reactExports.useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  return { toast, show };
}
function AttendanceApp() {
  const today = todayParts();
  const [sheet, setSheet] = reactExports.useState(() => load(LS_KEYS.sheet, { url: "", loadedAt: null }));
  const [sheetInput, setSheetInput] = reactExports.useState(sheet.url);
  const [students, setStudents] = reactExports.useState(() => load(LS_KEYS.students, []));
  const [records, setRecords] = reactExports.useState(() => load(LS_KEYS.records, {}));
  const [loadingSheet, setLoadingSheet] = reactExports.useState(false);
  const [tab, setTab] = reactExports.useState("mark");
  const [month, setMonth] = reactExports.useState(today.month0);
  const [year, setYear] = reactExports.useState(today.year);
  const [classFilter, setClassFilter] = reactExports.useState("all");
  const [newRoll, setNewRoll] = reactExports.useState("");
  const [newName, setNewName] = reactExports.useState("");
  const [newClass, setNewClass] = reactExports.useState("");
  const { toast, show } = useToast();
  reactExports.useEffect(() => save(LS_KEYS.sheet, sheet), [sheet]);
  reactExports.useEffect(() => save(LS_KEYS.students, students), [students]);
  reactExports.useEffect(() => save(LS_KEYS.records, records), [records]);
  const classes = reactExports.useMemo(() => {
    const s = /* @__PURE__ */ new Set();
    students.forEach((st) => st.klass && s.add(st.klass));
    return Array.from(s).sort();
  }, [students]);
  const filteredStudents = reactExports.useMemo(() => {
    if (classFilter === "all") return students;
    return students.filter((s) => s.klass === classFilter);
  }, [students, classFilter]);
  const dim = daysInMonth(year, month);
  const days = reactExports.useMemo(() => Array.from({ length: dim }, (_, i) => i + 1), [dim]);
  const isCurrentMonth = year === today.year && month === today.month0;
  const todayIso = isoDate(today.year, today.month0, today.day);
  const stats = reactExports.useMemo(() => {
    let present = 0, absent = 0, na = 0;
    const dateKey = isCurrentMonth ? todayIso : null;
    filteredStudents.forEach((s) => {
      if (!dateKey) {
        na++;
        return;
      }
      const v = records[s.id]?.[dateKey];
      if (v === "P") present++;
      else if (v === "A") absent++;
      else na++;
    });
    return { total: filteredStudents.length, present, absent, na };
  }, [filteredStudents, records, isCurrentMonth, todayIso]);
  async function connectSheet() {
    const url = sheetInput.trim();
    if (!url) {
      show("Paste a Google Sheet URL first", "error");
      return;
    }
    const id = extractSheetId(url);
    if (!id) {
      show("That doesn't look like a Google Sheet URL", "error");
      return;
    }
    const gid = extractGid(url);
    setLoadingSheet(true);
    try {
      const result = await fetchSheetCsv({ data: { sheetId: id, gid } });
      if (!result.ok) throw new Error(result.error);
      const rows = parseCSV(result.csv);
      const parsed = studentsFromCSV(rows);
      if (rows.length === 0) {
        throw new Error("No CSV data was returned. Make sure the sheet is public and contains at least one row of student data.");
      }
      if (parsed.length === 0) {
        const firstRow = rows[0] ?? [];
        const headerRow = firstRow.map((cell) => cell.trim().toLowerCase()).join(", ");
        const hasHeader = /name|student/.test(headerRow);
        if (hasHeader) {
          throw new Error("Sheet loaded, but no student rows were found. Add rows below the header and try again.");
        }
        throw new Error(`No student names found. Sheet has ${rows.length} row(s). Expected a column named "Name" (or just a list of names).`);
      }
      setStudents(parsed);
      setSheet({ url, loadedAt: Date.now() });
      show(`Loaded ${parsed.length} students from sheet`, "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      show(`Could not load sheet: ${msg}`, "error");
    } finally {
      setLoadingSheet(false);
    }
  }
  function setMark(studentId, dateKey, value) {
    setRecords((prev) => {
      const next = { ...prev };
      const row = { ...next[studentId] ?? {} };
      if (value === null) delete row[dateKey];
      else row[dateKey] = value;
      next[studentId] = row;
      return next;
    });
  }
  function cycleMark(studentId, dateKey) {
    const cur = records[studentId]?.[dateKey];
    const next = cur === void 0 ? "P" : cur === "P" ? "A" : null;
    setMark(studentId, dateKey, next);
  }
  function quickMarkToday(value) {
    if (!isCurrentMonth) {
      show("Switch to the current month to quick-mark today", "error");
      return;
    }
    setRecords((prev) => {
      const next = { ...prev };
      filteredStudents.forEach((s) => {
        const row = { ...next[s.id] ?? {} };
        if (value === null) delete row[todayIso];
        else row[todayIso] = value;
        next[s.id] = row;
      });
      return next;
    });
    show(value === null ? "Cleared today's marks" : value === "P" ? "All marked present" : "All marked absent", "success");
  }
  function addStudent() {
    const roll = newRoll.trim();
    const name = newName.trim();
    const klass = newClass.trim();
    if (!name) {
      show("Name is required", "error");
      return;
    }
    const id = `${roll || name}::${name}`.toLowerCase();
    if (students.some((s) => s.id === id)) {
      show("Student already exists", "error");
      return;
    }
    setStudents((prev) => [...prev, { id, roll: roll || String(prev.length + 1), name, klass }]);
    setNewRoll("");
    setNewName("");
    setNewClass("");
    show(`Added ${name}`, "success");
  }
  function deleteStudent(id) {
    if (!confirm("Remove this student and all their attendance marks?")) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setRecords((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
    show("Student removed", "success");
  }
  function exportCSV() {
    const header = ["Roll", "Name", "Class", ...days.map((d) => isoDate(year, month, d))];
    const lines = [header.join(",")];
    filteredStudents.forEach((s) => {
      const row = [s.roll, `"${s.name.replace(/"/g, '""')}"`, s.klass];
      days.forEach((d) => row.push(records[s.id]?.[isoDate(year, month, d)] ?? ""));
      lines.push(row.join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${MONTHS[month]}-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    show("CSV exported", "success");
  }
  const summary = reactExports.useMemo(() => {
    return filteredStudents.map((s) => {
      let p = 0, a = 0;
      days.forEach((d) => {
        const v = records[s.id]?.[isoDate(year, month, d)];
        if (v === "P") p++;
        else if (v === "A") a++;
      });
      const total = p + a;
      const pct = total === 0 ? 0 : Math.round(p / total * 100);
      return { student: s, present: p, absent: a, total, pct };
    });
  }, [filteredStudents, records, days, year, month]);
  const isConnected = sheet.loadedAt != null;
  const years = [year - 2, year - 1, year, year + 1];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-root", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-app", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-logo", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-logo-icon", children: "📋" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "AttendanceMS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sub", children: isConnected ? "Google Sheet connected" : "Roster manager" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-header-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `att-badge ${isConnected ? "ok" : ""}`, children: isConnected ? "● Connected" : "○ Not Connected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "att-badge", children: [
            students.length,
            " students"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-config-banner", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cb-icon", children: "🔗" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cb-text", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Connect a Google Sheet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Paste any public Google Sheet link with columns: Roll, Name, Class." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-config-form", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "att-config-input",
              type: "text",
              placeholder: "https://docs.google.com/spreadsheets/d/...",
              value: sheetInput,
              onChange: (e) => setSheetInput(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "att-btn att-btn-primary", disabled: loadingSheet, onClick: connectSheet, children: loadingSheet ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "att-spinner" }),
            "Loading"
          ] }) : "Load →" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-tabs", role: "tablist", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `att-tab ${tab === "mark" ? "active" : ""}`, onClick: () => setTab("mark"), children: "✏️ Mark Attendance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `att-tab ${tab === "view" ? "active" : ""}`, onClick: () => setTab("view"), children: "📊 View Records" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `att-tab ${tab === "manage" ? "active" : ""}`, onClick: () => setTab("manage"), children: "👥 Manage Students" })
      ] }),
      tab === "mark" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "att-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-controls", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-control-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: month, onChange: (e) => setMonth(Number(e.target.value)), children: MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i, children: m }, m)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-control-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Year" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: year, onChange: (e) => setYear(Number(e.target.value)), children: years.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, children: y }, y)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-control-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: classFilter, onChange: (e) => setClassFilter(e.target.value), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All classes" }),
              classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "att-btn att-btn-ghost", onClick: exportCSV, disabled: students.length === 0, children: "⬇ Export CSV" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-stats", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-stat-card total", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-val", children: stats.total }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-lbl", children: "Students" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-stat-card present", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-val", children: stats.present }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-lbl", children: "Present Today" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-stat-card absent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-val", children: stats.absent }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-lbl", children: "Absent Today" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-stat-card na-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-val", children: stats.na }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-lbl", children: "Not Marked" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-quick-mark", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lbl", children: "Quick mark today for all visible students:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "qm-btn qm-p", onClick: () => quickMarkToday("P"), children: "✓ All Present" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "qm-btn qm-a", onClick: () => quickMarkToday("A"), children: "✗ All Absent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "qm-btn qm-clear", onClick: () => quickMarkToday(null), children: "Clear" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-table-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-table-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
              MONTHS[month],
              " ",
              year
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-legend", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Legend:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cell-btn cell-P", children: "P" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Present" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cell-btn cell-A", children: "A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Absent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cell-btn cell-NA", children: "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Not marked" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text3)" }, children: "· Click to cycle P → A → clear" })
            ] })
          ] }),
          filteredStudents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-loading", children: 'No students yet. Load a Google Sheet or add students manually under "Manage Students".' }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-table-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "att-table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Roll" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Class" }),
              days.map((d) => {
                const isToday = isCurrentMonth && d === today.day;
                return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `day-col ${isToday ? "today-head" : ""}`, children: d }, d);
              })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredStudents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: s.roll }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: s.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: s.klass || "—" }),
              days.map((d) => {
                const key = isoDate(year, month, d);
                const v = records[s.id]?.[key];
                const isToday = isCurrentMonth && d === today.day;
                const isFuture = isCurrentMonth && d > today.day;
                const label = v ?? "—";
                const cls = v === "P" ? "cell-P" : v === "A" ? "cell-A" : "cell-NA";
                return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: isToday ? "today-col" : "", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: `cell-btn ${cls} ${isFuture ? "future-day" : ""}`,
                    onClick: () => cycleMark(s.id, key),
                    title: `${s.name} · ${key}`,
                    children: label
                  }
                ) }, d);
              })
            ] }, s.id)) })
          ] }) })
        ] })
      ] }),
      tab === "view" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "att-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-controls", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-control-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: month, onChange: (e) => setMonth(Number(e.target.value)), children: MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i, children: m }, m)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-control-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Year" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: year, onChange: (e) => setYear(Number(e.target.value)), children: years.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, children: y }, y)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-control-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: classFilter, onChange: (e) => setClassFilter(e.target.value), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All classes" }),
              classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "att-btn att-btn-ghost", onClick: exportCSV, disabled: students.length === 0, children: "⬇ Export CSV" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-ms", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-header", children: [
            "📈 Monthly Summary — ",
            MONTHS[month],
            " ",
            year
          ] }),
          summary.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-loading", children: "No students to summarize." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "ms-table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Roll" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Class" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Present" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Absent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Attendance %" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: summary.map((r) => {
              const cls = r.pct >= 75 ? "pct-good" : r.pct >= 50 ? "pct-mid" : "pct-bad";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontFamily: "var(--font-mono)", color: "var(--text3)" }, children: r.student.roll }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.student.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.student.klass || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "var(--present)" }, children: r.present }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "var(--absent)" }, children: r.absent }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pct-bar", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bar-bg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bar-fill ${cls}`, style: { width: `${r.pct}%` } }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, minWidth: 38, textAlign: "right" }, children: r.total === 0 ? "—" : `${r.pct}%` })
                ] }) })
              ] }, r.student.id);
            }) })
          ] })
        ] })
      ] }),
      tab === "manage" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "att-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-note", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Note:" }),
          " Writing back to Google Sheets requires per-user OAuth. This app reads your sheet via the public CSV export and stores all marks in your browser. Use ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Export CSV" }),
          " to push results back to Sheets manually, or ask to upgrade to OAuth-based sync."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-add-panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "➕ Add New Student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-add-form", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-control-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Roll No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newRoll, onChange: (e) => setNewRoll(e.target.value), placeholder: "e.g. 12" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-control-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newName, onChange: (e) => setNewName(e.target.value), placeholder: "Student name" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-control-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Class" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newClass, onChange: (e) => setNewClass(e.target.value), placeholder: "e.g. 10-A" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "att-btn att-btn-primary", onClick: addStudent, children: "Add Student" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-table-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "att-table-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
              "Student List (",
              students.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "att-btn att-btn-ghost att-btn-sm", disabled: !sheet.url, onClick: connectSheet, children: "🔄 Refresh from Sheet" })
          ] }),
          students.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-loading", children: "No students yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "att-table-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "att-table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Roll" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Class" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { width: 60 } })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: students.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: s.roll }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: s.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: s.klass || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "delete-row-btn", onClick: () => deleteStudent(s.id), title: "Remove", children: "✕" }) })
            ] }, s.id)) })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `att-toast ${toast ? "show" : ""} ${toast?.kind ?? ""}`, children: toast && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "toast-icon", children: toast.kind === "success" ? "✓" : toast.kind === "error" ? "✕" : "ℹ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: toast.msg })
    ] }) })
  ] });
}
const SplitComponent = AttendanceApp;
export {
  SplitComponent as component
};
