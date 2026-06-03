import { format } from "date-fns";
import type {
  AttendanceRecord,
  AttendanceStats,
  Achievement,
  Student,
  StudentRanking,
  Holiday,
} from "./types";
import { attendanceStorage, achievementStorage, studentStorage, holidayStorage } from "./storage";

// ID generation using crypto.randomUUID or fallback
export const generateId = (): string => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Attendance calculations
export const calculateAttendanceStats = (
  studentId: string,
  classId?: string
): AttendanceStats => {
  const records = attendanceStorage.getByStudent(studentId);
  const filtered = classId
    ? records.filter((r) => r.classId === classId)
    : records;

  const presentDays = filtered.filter((r) => r.status === "present").length;
  const absentDays = filtered.filter((r) => r.status === "absent").length;
  const leaveDays = filtered.filter((r) => r.status === "leave").length;
  const lateDays = filtered.filter((r) => r.status === "late").length;
  const totalDays = filtered.length;

  const attendancePercentage =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Calculate streaks
  const sortedRecords = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  sortedRecords.forEach((record) => {
    if (record.status === "present") {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else if (record.status !== "leave") {
      currentStreak = tempStreak;
      tempStreak = 0;
    }
  });

  currentStreak = currentStreak === 0 ? tempStreak : currentStreak;

  return {
    studentId,
    totalDays,
    presentDays,
    absentDays,
    leaveDays,
    lateDays,
    attendancePercentage,
    currentStreak,
    longestStreak,
  };
};

// Student ranking system
export const calculateStudentRankings = (classId?: string): StudentRanking[] => {
  const students = classId
    ? studentStorage.getByClass(classId)
    : studentStorage.getAll();

  const rankings = students
    .map((student) => {
      const stats = calculateAttendanceStats(student.id, classId);
      const achievements = achievementStorage.getByStudent(student.id);
      const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);

      return {
        rank: 0,
        studentId: student.id,
        studentName: student.name,
        attendancePercentage: stats.attendancePercentage,
        totalAchievements: achievements.length,
        totalPoints,
      };
    })
    .sort((a, b) => {
      if (b.attendancePercentage !== a.attendancePercentage) {
        return b.attendancePercentage - a.attendancePercentage;
      }
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return b.totalAchievements - a.totalAchievements;
    })
    .map((ranking, index) => ({
      ...ranking,
      rank: index + 1,
    }));

  return rankings;
};

// Low attendance alerts
export const getLowAttendanceAlerts = (
  threshold: number
): { student: Student; percentage: number }[] => {
  const students = studentStorage.getAll();

  return students
    .filter((student) => student.isActive)
    .map((student) => ({
      student,
      percentage: calculateAttendanceStats(student.id).attendancePercentage,
    }))
    .filter((alert) => alert.percentage < threshold)
    .sort((a, b) => a.percentage - b.percentage);
};

// Birthday reminders
export const getBirthdayReminders = (daysAhead: number = 7): Student[] => {
  const students = studentStorage.getAll();
  const today = new Date();

  return students.filter((student) => {
    if (!student.dateOfBirth) return false;

    const birthDate = new Date(student.dateOfBirth);
    const upcomingBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    if (upcomingBirthday < today) {
      upcomingBirthday.setFullYear(upcomingBirthday.getFullYear() + 1);
    }

    const daysUntilBirthday = Math.ceil(
      (upcomingBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysUntilBirthday <= daysAhead && daysUntilBirthday >= 0;
  });
};

// Check if date is a holiday
export const isHoliday = (date: string): Holiday | null => {
  const holidays = holidayStorage.getAll();
  return holidays.find((h) => h.date === date) || null;
};

// Get holidays in date range
export const getHolidaysInRange = (startDate: string, endDate: string): Holiday[] => {
  const holidays = holidayStorage.getAll();
  return holidays.filter(
    (h) => h.date >= startDate && h.date <= endDate
  );
};

// Export/Import utilities
export const exportToCSV = (
  data: any[],
  filename: string
): void => {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          const escaped =
            typeof value === "string" && value.includes(",")
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          return escaped;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Import CSV data
export const importFromCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
          reject(new Error("CSV file is empty"));
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim());
        const data = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim());
          return headers.reduce(
            (obj, header, index) => {
              obj[header] = values[index];
              return obj;
            },
            {} as Record<string, string>
          );
        });

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

// Pagination helper
export const paginate = <T,>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; total: number; pages: number } => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    total: items.length,
    pages: Math.ceil(items.length / pageSize),
  };
};

// Search and filter helper
export const filterAndSort = <T,>(
  items: T[],
  searchQuery: string,
  searchFields: (keyof T)[],
  sortField?: keyof T,
  sortOrder: "asc" | "desc" = "asc"
): T[] => {
  let filtered = items;

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return String(value).toLowerCase().includes(query);
      })
    );
  }

  if (sortField) {
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  return filtered;
};

// Date utilities
export const getSchoolYear = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Assuming school year starts in April (India standard)
  const startYear = month >= 3 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
};

// Get weekday name
export const getWeekdayName = (date: string): string => {
  return format(new Date(date), "EEEE");
};

// Get date string in dd-MM-yyyy format
export const formatDateString = (date: string): string => {
  return format(new Date(date), "dd-MM-yyyy");
};

// Round percentage
export const roundPercentage = (value: number): number => {
  return Math.round(value * 100) / 100;
};
