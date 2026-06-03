import type {
  Student,
  Class,
  AttendanceRecord,
  Leave,
  Holiday,
  Announcement,
  Achievement,
  SeatArrangement,
  Settings,
} from "./types";

const STORAGE_KEYS = {
  STUDENTS: "cc_students",
  CLASSES: "cc_classes",
  ATTENDANCE: "cc_attendance",
  LEAVES: "cc_leaves",
  HOLIDAYS: "cc_holidays",
  ANNOUNCEMENTS: "cc_announcements",
  ACHIEVEMENTS: "cc_achievements",
  SEAT_ARRANGEMENTS: "cc_seat_arrangements",
  SETTINGS: "cc_settings",
} as const;

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

function removeFromStorage(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

// Student storage functions
export const studentStorage = {
  getAll: (): Student[] => getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, []),
  getById: (id: string): Student | null => {
    const students = studentStorage.getAll();
    return students.find((s) => s.id === id) || null;
  },
  getByClass: (classId: string): Student[] => {
    const students = studentStorage.getAll();
    return students.filter((s) => s.classId === classId && s.isActive);
  },
  add: (student: Student): boolean => {
    const students = studentStorage.getAll();
    students.push(student);
    return saveToStorage(STORAGE_KEYS.STUDENTS, students);
  },
  update: (id: string, updates: Partial<Student>): boolean => {
    const students = studentStorage.getAll();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return false;
    students[index] = { ...students[index], ...updates };
    return saveToStorage(STORAGE_KEYS.STUDENTS, students);
  },
  delete: (id: string): boolean => {
    const students = studentStorage.getAll();
    const filtered = students.filter((s) => s.id !== id);
    return saveToStorage(STORAGE_KEYS.STUDENTS, filtered);
  },
  search: (query: string): Student[] => {
    const students = studentStorage.getAll();
    const lowerQuery = query.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.rollNumber.toLowerCase().includes(lowerQuery) ||
        s.email.toLowerCase().includes(lowerQuery)
    );
  },
};

// Class storage functions
export const classStorage = {
  getAll: (): Class[] => getFromStorage<Class[]>(STORAGE_KEYS.CLASSES, []),
  getById: (id: string): Class | null => {
    const classes = classStorage.getAll();
    return classes.find((c) => c.id === id) || null;
  },
  add: (classData: Class): boolean => {
    const classes = classStorage.getAll();
    classes.push(classData);
    return saveToStorage(STORAGE_KEYS.CLASSES, classes);
  },
  update: (id: string, updates: Partial<Class>): boolean => {
    const classes = classStorage.getAll();
    const index = classes.findIndex((c) => c.id === id);
    if (index === -1) return false;
    classes[index] = { ...classes[index], ...updates };
    return saveToStorage(STORAGE_KEYS.CLASSES, classes);
  },
  delete: (id: string): boolean => {
    const classes = classStorage.getAll();
    const filtered = classes.filter((c) => c.id !== id);
    return saveToStorage(STORAGE_KEYS.CLASSES, filtered);
  },
};

// Attendance storage functions
export const attendanceStorage = {
  getAll: (): AttendanceRecord[] =>
    getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []),
  getByStudent: (studentId: string): AttendanceRecord[] => {
    const records = attendanceStorage.getAll();
    return records.filter((r) => r.studentId === studentId);
  },
  getByClass: (classId: string, date?: string): AttendanceRecord[] => {
    const records = attendanceStorage.getAll();
    return records.filter(
      (r) => r.classId === classId && (!date || r.date === date)
    );
  },
  getByDate: (date: string): AttendanceRecord[] => {
    const records = attendanceStorage.getAll();
    return records.filter((r) => r.date === date);
  },
  add: (record: AttendanceRecord): boolean => {
    const records = attendanceStorage.getAll();
    records.push(record);
    return saveToStorage(STORAGE_KEYS.ATTENDANCE, records);
  },
  addBulk: (records: AttendanceRecord[]): boolean => {
    const existing = attendanceStorage.getAll();
    const combined = [...existing, ...records];
    return saveToStorage(STORAGE_KEYS.ATTENDANCE, combined);
  },
  update: (id: string, updates: Partial<AttendanceRecord>): boolean => {
    const records = attendanceStorage.getAll();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return false;
    records[index] = { ...records[index], ...updates };
    return saveToStorage(STORAGE_KEYS.ATTENDANCE, records);
  },
  delete: (id: string): boolean => {
    const records = attendanceStorage.getAll();
    const filtered = records.filter((r) => r.id !== id);
    return saveToStorage(STORAGE_KEYS.ATTENDANCE, filtered);
  },
};

// Leave storage functions
export const leaveStorage = {
  getAll: (): Leave[] => getFromStorage<Leave[]>(STORAGE_KEYS.LEAVES, []),
  getByStudent: (studentId: string): Leave[] => {
    const leaves = leaveStorage.getAll();
    return leaves.filter((l) => l.studentId === studentId);
  },
  getByClass: (classId: string): Leave[] => {
    const leaves = leaveStorage.getAll();
    return leaves.filter((l) => l.classId === classId);
  },
  getPending: (): Leave[] => {
    const leaves = leaveStorage.getAll();
    return leaves.filter((l) => l.status === "pending");
  },
  add: (leave: Leave): boolean => {
    const leaves = leaveStorage.getAll();
    leaves.push(leave);
    return saveToStorage(STORAGE_KEYS.LEAVES, leaves);
  },
  update: (id: string, updates: Partial<Leave>): boolean => {
    const leaves = leaveStorage.getAll();
    const index = leaves.findIndex((l) => l.id === id);
    if (index === -1) return false;
    leaves[index] = { ...leaves[index], ...updates };
    return saveToStorage(STORAGE_KEYS.LEAVES, leaves);
  },
  delete: (id: string): boolean => {
    const leaves = leaveStorage.getAll();
    const filtered = leaves.filter((l) => l.id !== id);
    return saveToStorage(STORAGE_KEYS.LEAVES, filtered);
  },
};

// Holiday storage functions
export const holidayStorage = {
  getAll: (): Holiday[] => getFromStorage<Holiday[]>(STORAGE_KEYS.HOLIDAYS, []),
  getByMonth: (year: number, month: number): Holiday[] => {
    const holidays = holidayStorage.getAll();
    return holidays.filter((h) => {
      const date = new Date(h.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  },
  add: (holiday: Holiday): boolean => {
    const holidays = holidayStorage.getAll();
    holidays.push(holiday);
    return saveToStorage(STORAGE_KEYS.HOLIDAYS, holidays);
  },
  update: (id: string, updates: Partial<Holiday>): boolean => {
    const holidays = holidayStorage.getAll();
    const index = holidays.findIndex((h) => h.id === id);
    if (index === -1) return false;
    holidays[index] = { ...holidays[index], ...updates };
    return saveToStorage(STORAGE_KEYS.HOLIDAYS, holidays);
  },
  delete: (id: string): boolean => {
    const holidays = holidayStorage.getAll();
    const filtered = holidays.filter((h) => h.id !== id);
    return saveToStorage(STORAGE_KEYS.HOLIDAYS, filtered);
  },
};

// Announcement storage functions
export const announcementStorage = {
  getAll: (): Announcement[] =>
    getFromStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, []),
  getByClass: (classId: string): Announcement[] => {
    const announcements = announcementStorage.getAll();
    return announcements.filter(
      (a) => !a.classId || a.classId === classId
    );
  },
  add: (announcement: Announcement): boolean => {
    const announcements = announcementStorage.getAll();
    announcements.push(announcement);
    return saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  },
  update: (id: string, updates: Partial<Announcement>): boolean => {
    const announcements = announcementStorage.getAll();
    const index = announcements.findIndex((a) => a.id === id);
    if (index === -1) return false;
    announcements[index] = { ...announcements[index], ...updates };
    return saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  },
  delete: (id: string): boolean => {
    const announcements = announcementStorage.getAll();
    const filtered = announcements.filter((a) => a.id !== id);
    return saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, filtered);
  },
};

// Achievement storage functions
export const achievementStorage = {
  getAll: (): Achievement[] =>
    getFromStorage<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, []),
  getByStudent: (studentId: string): Achievement[] => {
    const achievements = achievementStorage.getAll();
    return achievements.filter((a) => a.studentId === studentId);
  },
  getByClass: (classId: string): Achievement[] => {
    const achievements = achievementStorage.getAll();
    return achievements.filter((a) => a.classId === classId);
  },
  add: (achievement: Achievement): boolean => {
    const achievements = achievementStorage.getAll();
    achievements.push(achievement);
    return saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  },
  update: (id: string, updates: Partial<Achievement>): boolean => {
    const achievements = achievementStorage.getAll();
    const index = achievements.findIndex((a) => a.id === id);
    if (index === -1) return false;
    achievements[index] = { ...achievements[index], ...updates };
    return saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  },
  delete: (id: string): boolean => {
    const achievements = achievementStorage.getAll();
    const filtered = achievements.filter((a) => a.id !== id);
    return saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, filtered);
  },
};

// Seat Arrangement storage functions
export const seatArrangementStorage = {
  getAll: (): SeatArrangement[] =>
    getFromStorage<SeatArrangement[]>(STORAGE_KEYS.SEAT_ARRANGEMENTS, []),
  getByClass: (classId: string): SeatArrangement[] => {
    const arrangements = seatArrangementStorage.getAll();
    return arrangements.filter((s) => s.classId === classId);
  },
  getByStudent: (studentId: string): SeatArrangement | null => {
    const arrangements = seatArrangementStorage.getAll();
    return arrangements.find((s) => s.studentId === studentId) || null;
  },
  add: (arrangement: SeatArrangement): boolean => {
    const arrangements = seatArrangementStorage.getAll();
    arrangements.push(arrangement);
    return saveToStorage(STORAGE_KEYS.SEAT_ARRANGEMENTS, arrangements);
  },
  update: (id: string, updates: Partial<SeatArrangement>): boolean => {
    const arrangements = seatArrangementStorage.getAll();
    const index = arrangements.findIndex((s) => s.id === id);
    if (index === -1) return false;
    arrangements[index] = { ...arrangements[index], ...updates };
    return saveToStorage(STORAGE_KEYS.SEAT_ARRANGEMENTS, arrangements);
  },
  delete: (id: string): boolean => {
    const arrangements = seatArrangementStorage.getAll();
    const filtered = arrangements.filter((s) => s.id !== id);
    return saveToStorage(STORAGE_KEYS.SEAT_ARRANGEMENTS, filtered);
  },
};

// Settings storage functions
export const settingsStorage = {
  getSettings: (): Settings =>
    getFromStorage<Settings>(STORAGE_KEYS.SETTINGS, {
      schoolName: "Class Companion School",
      theme: "dark",
      attendancePercentageThreshold: 75,
      lowAttendanceAlertThreshold: 70,
      markingDeadlineHours: 24,
      defaultTeacherName: "Admin",
    }),
  updateSettings: (updates: Partial<Settings>): boolean => {
    const current = settingsStorage.getSettings();
    const updated = { ...current, ...updates };
    return saveToStorage(STORAGE_KEYS.SETTINGS, updated);
  },
};

// Clear all storage (for development/testing)
export const clearAllStorage = (): boolean => {
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

// Export all storage keys for reference
export { STORAGE_KEYS };
