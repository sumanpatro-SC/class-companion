// Student type
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  parentName: string;
  parentPhone: string;
  address: string;
  classId: string;
  seatPosition?: string;
  joinDate: string;
  isActive: boolean;
}

// Class type
export interface Class {
  id: string;
  name: string;
  grade: string;
  section: string;
  capacity: number;
  description: string;
  createdAt: string;
  teachers: string[];
  roomNumber?: string;
}

// Attendance type
export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "leave" | "late";
  remarks?: string;
  markedAt: string;
  markedBy: string;
}

// Leave type
export interface Leave {
  id: string;
  studentId: string;
  classId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

// Holiday type
export interface Holiday {
  id: string;
  name: string;
  date: string;
  description?: string;
  type: "national" | "school" | "cultural" | "other";
  createdAt: string;
}

// Announcement type
export interface Announcement {
  id: string;
  classId?: string;
  title: string;
  content: string;
  type: "general" | "urgent" | "info";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

// Achievement type
export interface Achievement {
  id: string;
  studentId: string;
  classId: string;
  title: string;
  description: string;
  date: string;
  category: "academic" | "sports" | "cultural" | "behavioral" | "other";
  points: number;
  certificateUrl?: string;
  createdAt: string;
}

// Seat Arrangement type
export interface SeatArrangement {
  id: string;
  classId: string;
  studentId: string;
  row: number;
  column: number;
  updatedAt: string;
}

// Settings type
export interface Settings {
  schoolName: string;
  schoolLogo?: string;
  schoolAddress?: string;
  schoolPhone?: string;
  schoolEmail?: string;
  theme: "dark" | "light";
  attendancePercentageThreshold: number;
  lowAttendanceAlertThreshold: number;
  markingDeadlineHours: number;
  defaultTeacherName: string;
}

// Attendance Statistics
export interface AttendanceStats {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  lateDays: number;
  attendancePercentage: number;
  currentStreak: number;
  longestStreak: number;
}

// Student Ranking
export interface StudentRanking {
  rank: number;
  studentId: string;
  studentName: string;
  attendancePercentage: number;
  totalAchievements: number;
  totalPoints: number;
}
