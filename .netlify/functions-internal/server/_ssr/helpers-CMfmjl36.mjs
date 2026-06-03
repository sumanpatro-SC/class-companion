import { s as studentStorage, i as attendanceStorage, j as achievementStorage, k as holidayStorage } from "./storage-BZHb4tET.mjs";
import { f as format } from "../_libs/date-fns.mjs";
const generateId = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
};
const calculateAttendanceStats = (studentId, classId) => {
  const records = attendanceStorage.getByStudent(studentId);
  const filtered = classId ? records.filter((r) => r.classId === classId) : records;
  const presentDays = filtered.filter((r) => r.status === "present").length;
  const absentDays = filtered.filter((r) => r.status === "absent").length;
  const leaveDays = filtered.filter((r) => r.status === "leave").length;
  const lateDays = filtered.filter((r) => r.status === "late").length;
  const totalDays = filtered.length;
  const attendancePercentage = totalDays > 0 ? Math.round(presentDays / totalDays * 100) : 0;
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
    longestStreak
  };
};
const calculateStudentRankings = (classId) => {
  const students = classId ? studentStorage.getByClass(classId) : studentStorage.getAll();
  const rankings = students.map((student) => {
    const stats = calculateAttendanceStats(student.id, classId);
    const achievements = achievementStorage.getByStudent(student.id);
    const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
    return {
      rank: 0,
      studentId: student.id,
      studentName: student.name,
      attendancePercentage: stats.attendancePercentage,
      totalAchievements: achievements.length,
      totalPoints
    };
  }).sort((a, b) => {
    if (b.attendancePercentage !== a.attendancePercentage) {
      return b.attendancePercentage - a.attendancePercentage;
    }
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    return b.totalAchievements - a.totalAchievements;
  }).map((ranking, index) => ({
    ...ranking,
    rank: index + 1
  }));
  return rankings;
};
const getLowAttendanceAlerts = (threshold) => {
  const students = studentStorage.getAll();
  return students.filter((student) => student.isActive).map((student) => ({
    student,
    percentage: calculateAttendanceStats(student.id).attendancePercentage
  })).filter((alert) => alert.percentage < threshold).sort((a, b) => a.percentage - b.percentage);
};
const getBirthdayReminders = (daysAhead = 7) => {
  const students = studentStorage.getAll();
  const today = /* @__PURE__ */ new Date();
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
      (upcomingBirthday.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24)
    );
    return daysUntilBirthday <= daysAhead && daysUntilBirthday >= 0;
  });
};
const isHoliday = (date) => {
  const holidays = holidayStorage.getAll();
  return holidays.find((h) => h.date === date) || null;
};
const exportToCSV = (data, filename) => {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map(
      (row) => headers.map((header) => {
        const value = row[header];
        const escaped = typeof value === "string" && value.includes(",") ? `"${value.replace(/"/g, '""')}"` : value;
        return escaped;
      }).join(",")
    )
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const formatDateString = (date) => {
  return format(new Date(date), "dd-MM-yyyy");
};
export {
  getBirthdayReminders as a,
  calculateStudentRankings as b,
  calculateAttendanceStats as c,
  getLowAttendanceAlerts as d,
  exportToCSV as e,
  formatDateString as f,
  generateId as g,
  isHoliday as i
};
