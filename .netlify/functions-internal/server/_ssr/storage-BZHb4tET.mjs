import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as cn } from "./router-DsChniCp.mjs";
function PageHeader({
  title,
  description,
  className,
  children,
  actions
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("border-b border-border bg-background px-6 py-4", className), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground", children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: description }),
      children
    ] }),
    actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-4 flex items-center gap-2", children: actions })
  ] }) });
}
const Card = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const STORAGE_KEYS = {
  STUDENTS: "cc_students",
  CLASSES: "cc_classes",
  ATTENDANCE: "cc_attendance",
  LEAVES: "cc_leaves",
  HOLIDAYS: "cc_holidays",
  ANNOUNCEMENTS: "cc_announcements",
  ACHIEVEMENTS: "cc_achievements",
  SEAT_ARRANGEMENTS: "cc_seat_arrangements",
  SETTINGS: "cc_settings"
};
function getFromStorage(key, defaultValue) {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}
function saveToStorage(key, value) {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}
const studentStorage = {
  getAll: () => getFromStorage(STORAGE_KEYS.STUDENTS, []),
  getById: (id) => {
    const students = studentStorage.getAll();
    return students.find((s) => s.id === id) || null;
  },
  getByClass: (classId) => {
    const students = studentStorage.getAll();
    return students.filter((s) => s.classId === classId && s.isActive);
  },
  add: (student) => {
    const students = studentStorage.getAll();
    students.push(student);
    return saveToStorage(STORAGE_KEYS.STUDENTS, students);
  },
  update: (id, updates) => {
    const students = studentStorage.getAll();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return false;
    students[index] = { ...students[index], ...updates };
    return saveToStorage(STORAGE_KEYS.STUDENTS, students);
  },
  delete: (id) => {
    const students = studentStorage.getAll();
    const filtered = students.filter((s) => s.id !== id);
    return saveToStorage(STORAGE_KEYS.STUDENTS, filtered);
  },
  search: (query) => {
    const students = studentStorage.getAll();
    const lowerQuery = query.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(lowerQuery) || s.rollNumber.toLowerCase().includes(lowerQuery) || s.email.toLowerCase().includes(lowerQuery)
    );
  }
};
const classStorage = {
  getAll: () => getFromStorage(STORAGE_KEYS.CLASSES, []),
  getById: (id) => {
    const classes = classStorage.getAll();
    return classes.find((c) => c.id === id) || null;
  },
  add: (classData) => {
    const classes = classStorage.getAll();
    classes.push(classData);
    return saveToStorage(STORAGE_KEYS.CLASSES, classes);
  },
  update: (id, updates) => {
    const classes = classStorage.getAll();
    const index = classes.findIndex((c) => c.id === id);
    if (index === -1) return false;
    classes[index] = { ...classes[index], ...updates };
    return saveToStorage(STORAGE_KEYS.CLASSES, classes);
  },
  delete: (id) => {
    const classes = classStorage.getAll();
    const filtered = classes.filter((c) => c.id !== id);
    return saveToStorage(STORAGE_KEYS.CLASSES, filtered);
  }
};
const attendanceStorage = {
  getAll: () => getFromStorage(STORAGE_KEYS.ATTENDANCE, []),
  getByStudent: (studentId) => {
    const records = attendanceStorage.getAll();
    return records.filter((r) => r.studentId === studentId);
  },
  getByClass: (classId, date) => {
    const records = attendanceStorage.getAll();
    return records.filter(
      (r) => r.classId === classId && (!date || r.date === date)
    );
  },
  getByDate: (date) => {
    const records = attendanceStorage.getAll();
    return records.filter((r) => r.date === date);
  },
  add: (record) => {
    const records = attendanceStorage.getAll();
    records.push(record);
    return saveToStorage(STORAGE_KEYS.ATTENDANCE, records);
  },
  addBulk: (records) => {
    const existing = attendanceStorage.getAll();
    const combined = [...existing, ...records];
    return saveToStorage(STORAGE_KEYS.ATTENDANCE, combined);
  },
  update: (id, updates) => {
    const records = attendanceStorage.getAll();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return false;
    records[index] = { ...records[index], ...updates };
    return saveToStorage(STORAGE_KEYS.ATTENDANCE, records);
  },
  delete: (id) => {
    const records = attendanceStorage.getAll();
    const filtered = records.filter((r) => r.id !== id);
    return saveToStorage(STORAGE_KEYS.ATTENDANCE, filtered);
  }
};
const leaveStorage = {
  getAll: () => getFromStorage(STORAGE_KEYS.LEAVES, []),
  getByStudent: (studentId) => {
    const leaves = leaveStorage.getAll();
    return leaves.filter((l) => l.studentId === studentId);
  },
  getByClass: (classId) => {
    const leaves = leaveStorage.getAll();
    return leaves.filter((l) => l.classId === classId);
  },
  getPending: () => {
    const leaves = leaveStorage.getAll();
    return leaves.filter((l) => l.status === "pending");
  },
  add: (leave) => {
    const leaves = leaveStorage.getAll();
    leaves.push(leave);
    return saveToStorage(STORAGE_KEYS.LEAVES, leaves);
  },
  update: (id, updates) => {
    const leaves = leaveStorage.getAll();
    const index = leaves.findIndex((l) => l.id === id);
    if (index === -1) return false;
    leaves[index] = { ...leaves[index], ...updates };
    return saveToStorage(STORAGE_KEYS.LEAVES, leaves);
  },
  delete: (id) => {
    const leaves = leaveStorage.getAll();
    const filtered = leaves.filter((l) => l.id !== id);
    return saveToStorage(STORAGE_KEYS.LEAVES, filtered);
  }
};
const holidayStorage = {
  getAll: () => getFromStorage(STORAGE_KEYS.HOLIDAYS, []),
  getByMonth: (year, month) => {
    const holidays = holidayStorage.getAll();
    return holidays.filter((h) => {
      const date = new Date(h.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  },
  add: (holiday) => {
    const holidays = holidayStorage.getAll();
    holidays.push(holiday);
    return saveToStorage(STORAGE_KEYS.HOLIDAYS, holidays);
  },
  update: (id, updates) => {
    const holidays = holidayStorage.getAll();
    const index = holidays.findIndex((h) => h.id === id);
    if (index === -1) return false;
    holidays[index] = { ...holidays[index], ...updates };
    return saveToStorage(STORAGE_KEYS.HOLIDAYS, holidays);
  },
  delete: (id) => {
    const holidays = holidayStorage.getAll();
    const filtered = holidays.filter((h) => h.id !== id);
    return saveToStorage(STORAGE_KEYS.HOLIDAYS, filtered);
  }
};
const announcementStorage = {
  getAll: () => getFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, []),
  getByClass: (classId) => {
    const announcements = announcementStorage.getAll();
    return announcements.filter(
      (a) => !a.classId || a.classId === classId
    );
  },
  add: (announcement) => {
    const announcements = announcementStorage.getAll();
    announcements.push(announcement);
    return saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  },
  update: (id, updates) => {
    const announcements = announcementStorage.getAll();
    const index = announcements.findIndex((a) => a.id === id);
    if (index === -1) return false;
    announcements[index] = { ...announcements[index], ...updates };
    return saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  },
  delete: (id) => {
    const announcements = announcementStorage.getAll();
    const filtered = announcements.filter((a) => a.id !== id);
    return saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, filtered);
  }
};
const achievementStorage = {
  getAll: () => getFromStorage(STORAGE_KEYS.ACHIEVEMENTS, []),
  getByStudent: (studentId) => {
    const achievements = achievementStorage.getAll();
    return achievements.filter((a) => a.studentId === studentId);
  },
  getByClass: (classId) => {
    const achievements = achievementStorage.getAll();
    return achievements.filter((a) => a.classId === classId);
  },
  add: (achievement) => {
    const achievements = achievementStorage.getAll();
    achievements.push(achievement);
    return saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  },
  update: (id, updates) => {
    const achievements = achievementStorage.getAll();
    const index = achievements.findIndex((a) => a.id === id);
    if (index === -1) return false;
    achievements[index] = { ...achievements[index], ...updates };
    return saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  },
  delete: (id) => {
    const achievements = achievementStorage.getAll();
    const filtered = achievements.filter((a) => a.id !== id);
    return saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, filtered);
  }
};
const seatArrangementStorage = {
  getAll: () => getFromStorage(STORAGE_KEYS.SEAT_ARRANGEMENTS, []),
  getByClass: (classId) => {
    const arrangements = seatArrangementStorage.getAll();
    return arrangements.filter((s) => s.classId === classId);
  },
  getByStudent: (studentId) => {
    const arrangements = seatArrangementStorage.getAll();
    return arrangements.find((s) => s.studentId === studentId) || null;
  },
  add: (arrangement) => {
    const arrangements = seatArrangementStorage.getAll();
    arrangements.push(arrangement);
    return saveToStorage(STORAGE_KEYS.SEAT_ARRANGEMENTS, arrangements);
  },
  update: (id, updates) => {
    const arrangements = seatArrangementStorage.getAll();
    const index = arrangements.findIndex((s) => s.id === id);
    if (index === -1) return false;
    arrangements[index] = { ...arrangements[index], ...updates };
    return saveToStorage(STORAGE_KEYS.SEAT_ARRANGEMENTS, arrangements);
  },
  delete: (id) => {
    const arrangements = seatArrangementStorage.getAll();
    const filtered = arrangements.filter((s) => s.id !== id);
    return saveToStorage(STORAGE_KEYS.SEAT_ARRANGEMENTS, filtered);
  }
};
const settingsStorage = {
  getSettings: () => getFromStorage(STORAGE_KEYS.SETTINGS, {
    schoolName: "Class Companion School",
    theme: "dark",
    attendancePercentageThreshold: 75,
    lowAttendanceAlertThreshold: 70,
    markingDeadlineHours: 24,
    defaultTeacherName: "Admin"
  }),
  updateSettings: (updates) => {
    const current = settingsStorage.getSettings();
    const updated = { ...current, ...updates };
    return saveToStorage(STORAGE_KEYS.SETTINGS, updated);
  }
};
const clearAllStorage = () => {
  if (typeof window === "undefined") return false;
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error("Error clearing storage:", error);
    return false;
  }
};
export {
  Card as C,
  PageHeader as P,
  CardContent as a,
  CardHeader as b,
  classStorage as c,
  CardTitle as d,
  CardDescription as e,
  settingsStorage as f,
  clearAllStorage as g,
  seatArrangementStorage as h,
  attendanceStorage as i,
  achievementStorage as j,
  holidayStorage as k,
  leaveStorage as l,
  announcementStorage as m,
  studentStorage as s
};
