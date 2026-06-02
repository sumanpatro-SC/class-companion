import { useEffect, useMemo, useRef, useState } from "react";

// ---------- Types ----------
type Mark = "P" | "A" | null;

interface Student {
  id: string; // unique
  roll: string;
  name: string;
  klass: string;
}

// records[studentId][YYYY-MM-DD] = "P" | "A"
type Records = Record<string, Record<string, "P" | "A">>;

interface SheetState {
  url: string;
  loadedAt: number | null;
}

// ---------- LocalStorage helpers ----------
const LS_KEYS = {
  sheet: "att.sheet.v1",
  students: "att.students.v1",
  records: "att.records.v1",
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

// ---------- Sheet URL parsing ----------
function extractSheetId(url: string): string | null {
  const m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : null;
}
function extractGid(url: string): string {
  const m = url.match(/[#&?]gid=(\d+)/);
  return m ? m[1] : "0";
}
function csvExportUrl(url: string): string | null {
  const id = extractSheetId(url);
  if (!id) return null;
  const gid = extractGid(url);
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

// Minimal CSV parser supporting quoted fields & escaped quotes
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cur.push(field); field = ""; }
      else if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; }
      else if (c === "\r") { /* ignore */ }
      else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  return rows.filter((r) => r.some((cell) => cell.trim().length));
}

function studentsFromCSV(rows: string[][]): Student[] {
  if (rows.length === 0) return [];
  // Try to detect header row
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const hasHeader = header.some((h) => /roll|name|class/.test(h));
  const rollIdx = hasHeader ? header.findIndex((h) => /roll/.test(h)) : 0;
  const nameIdx = hasHeader ? header.findIndex((h) => /name/.test(h)) : 1;
  const classIdx = hasHeader ? header.findIndex((h) => /class/.test(h)) : 2;
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const out: Student[] = [];
  dataRows.forEach((r, i) => {
    const roll = (r[rollIdx] ?? "").trim() || String(i + 1);
    const name = (r[nameIdx] ?? "").trim();
    const klass = (r[classIdx] ?? "").trim();
    if (!name) return;
    out.push({ id: `${roll}::${name}`.toLowerCase(), roll, name, klass });
  });
  return out;
}

// ---------- Date helpers ----------
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function daysInMonth(year: number, month0: number) { return new Date(year, month0 + 1, 0).getDate(); }
function isoDate(year: number, month0: number, day: number) {
  const m = String(month0 + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}
function todayParts() {
  const d = new Date();
  return { year: d.getFullYear(), month0: d.getMonth(), day: d.getDate() };
}

// ---------- Toast ----------
function useToast() {
  const [toast, setToast] = useState<{ msg: string; kind: "success" | "error" | "info" } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  function show(msg: string, kind: "success" | "error" | "info" = "info") {
    setToast({ msg, kind });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2400);
  }
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  return { toast, show };
}

// ============ Main component ============
export function AttendanceApp() {
  const today = todayParts();
  const [sheet, setSheet] = useState<SheetState>(() => load<SheetState>(LS_KEYS.sheet, { url: "", loadedAt: null }));
  const [sheetInput, setSheetInput] = useState(sheet.url);
  const [students, setStudents] = useState<Student[]>(() => load<Student[]>(LS_KEYS.students, []));
  const [records, setRecords] = useState<Records>(() => load<Records>(LS_KEYS.records, {}));
  const [loadingSheet, setLoadingSheet] = useState(false);

  const [tab, setTab] = useState<"mark" | "view" | "manage">("mark");
  const [month, setMonth] = useState<number>(today.month0);
  const [year, setYear] = useState<number>(today.year);
  const [classFilter, setClassFilter] = useState<string>("all");

  // Manage form
  const [newRoll, setNewRoll] = useState("");
  const [newName, setNewName] = useState("");
  const [newClass, setNewClass] = useState("");

  const { toast, show } = useToast();

  // Persist
  useEffect(() => save(LS_KEYS.sheet, sheet), [sheet]);
  useEffect(() => save(LS_KEYS.students, students), [students]);
  useEffect(() => save(LS_KEYS.records, records), [records]);

  // Derived
  const classes = useMemo(() => {
    const s = new Set<string>();
    students.forEach((st) => st.klass && s.add(st.klass));
    return Array.from(s).sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (classFilter === "all") return students;
    return students.filter((s) => s.klass === classFilter);
  }, [students, classFilter]);

  const dim = daysInMonth(year, month);
  const days = useMemo(() => Array.from({ length: dim }, (_, i) => i + 1), [dim]);
  const isCurrentMonth = year === today.year && month === today.month0;
  const todayIso = isoDate(today.year, today.month0, today.day);

  // Stats for current view
  const stats = useMemo(() => {
    let present = 0, absent = 0, na = 0;
    const dateKey = isCurrentMonth ? todayIso : null;
    filteredStudents.forEach((s) => {
      if (!dateKey) { na++; return; }
      const v = records[s.id]?.[dateKey];
      if (v === "P") present++;
      else if (v === "A") absent++;
      else na++;
    });
    return { total: filteredStudents.length, present, absent, na };
  }, [filteredStudents, records, isCurrentMonth, todayIso]);

  // ----- Actions -----
  async function connectSheet() {
    const url = sheetInput.trim();
    if (!url) { show("Paste a Google Sheet URL first", "error"); return; }
    const csv = csvExportUrl(url);
    if (!csv) { show("That doesn't look like a Google Sheet URL", "error"); return; }
    setLoadingSheet(true);
    try {
      const res = await fetch(csv);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const rows = parseCSV(text);
      const parsed = studentsFromCSV(rows);
      if (parsed.length === 0) throw new Error("No students found in sheet");
      // Merge: keep existing records by id, replace student list
      setStudents(parsed);
      setSheet({ url, loadedAt: Date.now() });
      show(`Loaded ${parsed.length} students from sheet`, "success");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      show(`Could not load sheet: ${msg}. Make sure it's shared as "Anyone with the link".`, "error");
    } finally {
      setLoadingSheet(false);
    }
  }

  function setMark(studentId: string, dateKey: string, value: Mark) {
    setRecords((prev) => {
      const next = { ...prev };
      const row = { ...(next[studentId] ?? {}) };
      if (value === null) delete row[dateKey];
      else row[dateKey] = value;
      next[studentId] = row;
      return next;
    });
  }

  function cycleMark(studentId: string, dateKey: string) {
    const cur = records[studentId]?.[dateKey];
    const next: Mark = cur === undefined ? "P" : cur === "P" ? "A" : null;
    setMark(studentId, dateKey, next);
  }

  function quickMarkToday(value: Mark) {
    if (!isCurrentMonth) { show("Switch to the current month to quick-mark today", "error"); return; }
    setRecords((prev) => {
      const next = { ...prev };
      filteredStudents.forEach((s) => {
        const row = { ...(next[s.id] ?? {}) };
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
    if (!name) { show("Name is required", "error"); return; }
    const id = `${roll || name}::${name}`.toLowerCase();
    if (students.some((s) => s.id === id)) { show("Student already exists", "error"); return; }
    setStudents((prev) => [...prev, { id, roll: roll || String(prev.length + 1), name, klass }]);
    setNewRoll(""); setNewName(""); setNewClass("");
    show(`Added ${name}`, "success");
  }

  function deleteStudent(id: string) {
    if (!confirm("Remove this student and all their attendance marks?")) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setRecords((prev) => { const n = { ...prev }; delete n[id]; return n; });
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

  // Summary for "View Records" tab
  const summary = useMemo(() => {
    return filteredStudents.map((s) => {
      let p = 0, a = 0;
      days.forEach((d) => {
        const v = records[s.id]?.[isoDate(year, month, d)];
        if (v === "P") p++; else if (v === "A") a++;
      });
      const total = p + a;
      const pct = total === 0 ? 0 : Math.round((p / total) * 100);
      return { student: s, present: p, absent: a, total, pct };
    });
  }, [filteredStudents, records, days, year, month]);

  // ---------- Render ----------
  const isConnected = sheet.loadedAt != null;
  const years = [year - 2, year - 1, year, year + 1];

  return (
    <div className="att-root">
      <div className="att-app">
        <header>
          <div className="att-logo">
            <div className="att-logo-icon">📋</div>
            <div>
              <h1>AttendanceMS</h1>
              <div className="sub">{isConnected ? "Google Sheet connected" : "Roster manager"}</div>
            </div>
          </div>
          <div className="att-header-right">
            <span className={`att-badge ${isConnected ? "ok" : ""}`}>{isConnected ? "● Connected" : "○ Not Connected"}</span>
            <span className="att-badge">{students.length} students</span>
          </div>
        </header>

        <div className="att-config-banner">
          <div className="cb-icon">🔗</div>
          <div className="cb-text">
            <h3>Connect a Google Sheet</h3>
            <p>Paste any public Google Sheet link with columns: Roll, Name, Class.</p>
          </div>
          <div className="att-config-form">
            <input
              className="att-config-input"
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetInput}
              onChange={(e) => setSheetInput(e.target.value)}
            />
            <button className="att-btn att-btn-primary" disabled={loadingSheet} onClick={connectSheet}>
              {loadingSheet ? (<><span className="att-spinner" />Loading</>) : "Load →"}
            </button>
          </div>
        </div>

        <div className="att-tabs" role="tablist">
          <button className={`att-tab ${tab === "mark" ? "active" : ""}`} onClick={() => setTab("mark")}>✏️ Mark Attendance</button>
          <button className={`att-tab ${tab === "view" ? "active" : ""}`} onClick={() => setTab("view")}>📊 View Records</button>
          <button className={`att-tab ${tab === "manage" ? "active" : ""}`} onClick={() => setTab("manage")}>👥 Manage Students</button>
        </div>

        {tab === "mark" && (
          <section className="att-section">
            <div className="att-controls">
              <div className="att-control-group">
                <label>Month</label>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
              </div>
              <div className="att-control-group">
                <label>Year</label>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="att-control-group">
                <label>Class</label>
                <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                  <option value="all">All classes</option>
                  {classes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button className="att-btn att-btn-ghost" onClick={exportCSV} disabled={students.length === 0}>⬇ Export CSV</button>
            </div>

            <div className="att-stats">
              <div className="att-stat-card total"><span className="stat-val">{stats.total}</span><span className="stat-lbl">Students</span></div>
              <div className="att-stat-card present"><span className="stat-val">{stats.present}</span><span className="stat-lbl">Present Today</span></div>
              <div className="att-stat-card absent"><span className="stat-val">{stats.absent}</span><span className="stat-lbl">Absent Today</span></div>
              <div className="att-stat-card na-card"><span className="stat-val">{stats.na}</span><span className="stat-lbl">Not Marked</span></div>
            </div>

            <div className="att-quick-mark">
              <span className="lbl">Quick mark today for all visible students:</span>
              <button className="qm-btn qm-p" onClick={() => quickMarkToday("P")}>✓ All Present</button>
              <button className="qm-btn qm-a" onClick={() => quickMarkToday("A")}>✗ All Absent</button>
              <button className="qm-btn qm-clear" onClick={() => quickMarkToday(null)}>Clear</button>
            </div>

            <div className="att-table-wrap">
              <div className="att-table-header">
                <h2>{MONTHS[month]} {year}</h2>
                <div className="att-legend">
                  <span>Legend:</span>
                  <span className="cell-btn cell-P">P</span><span>Present</span>
                  <span className="cell-btn cell-A">A</span><span>Absent</span>
                  <span className="cell-btn cell-NA">—</span><span>Not marked</span>
                  <span style={{ color: "var(--text3)" }}>· Click to cycle P → A → clear</span>
                </div>
              </div>
              {filteredStudents.length === 0 ? (
                <div className="att-loading">No students yet. Load a Google Sheet or add students manually under "Manage Students".</div>
              ) : (
                <div className="att-table-scroll">
                  <table className="att-table">
                    <thead>
                      <tr>
                        <th>Roll</th>
                        <th>Name</th>
                        <th>Class</th>
                        {days.map((d) => {
                          const isToday = isCurrentMonth && d === today.day;
                          return <th key={d} className={`day-col ${isToday ? "today-head" : ""}`}>{d}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s) => (
                        <tr key={s.id}>
                          <td>{s.roll}</td>
                          <td>{s.name}</td>
                          <td>{s.klass || "—"}</td>
                          {days.map((d) => {
                            const key = isoDate(year, month, d);
                            const v = records[s.id]?.[key];
                            const isToday = isCurrentMonth && d === today.day;
                            const isFuture = isCurrentMonth && d > today.day;
                            const label = v ?? "—";
                            const cls = v === "P" ? "cell-P" : v === "A" ? "cell-A" : "cell-NA";
                            return (
                              <td key={d} className={isToday ? "today-col" : ""}>
                                <button
                                  className={`cell-btn ${cls} ${isFuture ? "future-day" : ""}`}
                                  onClick={() => cycleMark(s.id, key)}
                                  title={`${s.name} · ${key}`}
                                >
                                  {label}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {tab === "view" && (
          <section className="att-section">
            <div className="att-controls">
              <div className="att-control-group">
                <label>Month</label>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
              </div>
              <div className="att-control-group">
                <label>Year</label>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="att-control-group">
                <label>Class</label>
                <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                  <option value="all">All classes</option>
                  {classes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button className="att-btn att-btn-ghost" onClick={exportCSV} disabled={students.length === 0}>⬇ Export CSV</button>
            </div>

            <div className="att-ms">
              <div className="ms-header">📈 Monthly Summary — {MONTHS[month]} {year}</div>
              {summary.length === 0 ? (
                <div className="att-loading">No students to summarize.</div>
              ) : (
                <table className="ms-table">
                  <thead>
                    <tr><th>Roll</th><th>Name</th><th>Class</th><th>Present</th><th>Absent</th><th>Attendance %</th></tr>
                  </thead>
                  <tbody>
                    {summary.map((r) => {
                      const cls = r.pct >= 75 ? "pct-good" : r.pct >= 50 ? "pct-mid" : "pct-bad";
                      return (
                        <tr key={r.student.id}>
                          <td style={{ fontFamily: "var(--font-mono)", color: "var(--text3)" }}>{r.student.roll}</td>
                          <td>{r.student.name}</td>
                          <td>{r.student.klass || "—"}</td>
                          <td style={{ color: "var(--present)" }}>{r.present}</td>
                          <td style={{ color: "var(--absent)" }}>{r.absent}</td>
                          <td>
                            <div className="pct-bar">
                              <div className="bar-bg"><div className={`bar-fill ${cls}`} style={{ width: `${r.pct}%` }} /></div>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, minWidth: 38, textAlign: "right" }}>{r.total === 0 ? "—" : `${r.pct}%`}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {tab === "manage" && (
          <section className="att-section">
            <div className="att-note">
              <b>Note:</b> Writing back to Google Sheets requires per-user OAuth. This app reads your sheet via the public CSV export and stores all marks in your browser. Use <code>Export CSV</code> to push results back to Sheets manually, or ask to upgrade to OAuth-based sync.
            </div>

            <div className="att-add-panel">
              <h3>➕ Add New Student</h3>
              <div className="att-add-form">
                <div className="att-control-group">
                  <label>Roll No.</label>
                  <input type="text" value={newRoll} onChange={(e) => setNewRoll(e.target.value)} placeholder="e.g. 12" />
                </div>
                <div className="att-control-group">
                  <label>Name</label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Student name" />
                </div>
                <div className="att-control-group">
                  <label>Class</label>
                  <input type="text" value={newClass} onChange={(e) => setNewClass(e.target.value)} placeholder="e.g. 10-A" />
                </div>
                <button className="att-btn att-btn-primary" onClick={addStudent}>Add Student</button>
              </div>
            </div>

            <div className="att-table-wrap">
              <div className="att-table-header">
                <h2>Student List ({students.length})</h2>
                <button className="att-btn att-btn-ghost att-btn-sm" disabled={!sheet.url} onClick={connectSheet}>🔄 Refresh from Sheet</button>
              </div>
              {students.length === 0 ? (
                <div className="att-loading">No students yet.</div>
              ) : (
                <div className="att-table-scroll">
                  <table className="att-table">
                    <thead>
                      <tr><th>Roll</th><th>Name</th><th>Class</th><th style={{ width: 60 }}></th></tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.id}>
                          <td>{s.roll}</td>
                          <td>{s.name}</td>
                          <td>{s.klass || "—"}</td>
                          <td><button className="delete-row-btn" onClick={() => deleteStudent(s.id)} title="Remove">✕</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <div className={`att-toast ${toast ? "show" : ""} ${toast?.kind ?? ""}`}>
        {toast && (<><span className="toast-icon">{toast.kind === "success" ? "✓" : toast.kind === "error" ? "✕" : "ℹ"}</span><span>{toast.msg}</span></>)}
      </div>
    </div>
  );
}

export default AttendanceApp;