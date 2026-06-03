import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as studentStorage, P as PageHeader, C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription, c as classStorage, j as achievementStorage } from "./storage-BZHb4tET.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { a as getBirthdayReminders, c as calculateAttendanceStats } from "./helpers-CMfmjl36.mjs";
import { g as Search } from "../_libs/lucide-react.mjs";
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
import "../_libs/date-fns.mjs";
function StudentProfilesPage() {
  const [students, setStudents] = reactExports.useState([]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedStudent, setSelectedStudent] = reactExports.useState(null);
  reactExports.useEffect(() => {
    loadStudents();
  }, []);
  const loadStudents = () => {
    setStudents(studentStorage.getAll());
  };
  const filteredStudents = students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const getClassName = (classId) => {
    return classStorage.getById(classId)?.name || "Unknown";
  };
  const getAchievements = (studentId) => {
    return achievementStorage.getByStudent(studentId);
  };
  const upcomingBirthdays = getBirthdayReminders(7);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Student Profiles", description: "View detailed student profiles and information." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Students" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search students...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-[600px] overflow-y-auto", children: filteredStudents.map((student) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setSelectedStudent(student), className: `p-2 rounded cursor-pointer transition-colors ${selectedStudent?.id === student.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: student.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: student.rollNumber })
            ] }, student.id)) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: selectedStudent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: selectedStudent.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: getClassName(selectedStudent.classId) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Roll Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedStudent.rollNumber })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedStudent.email || "N/A" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedStudent.phone || "N/A" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "DOB" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedStudent.dateOfBirth || "N/A" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Parent/Guardian Information" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedStudent.parentName || "N/A" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedStudent.parentPhone || "N/A" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedStudent.address || "N/A" })
              ] })
            ] })
          ] }),
          (() => {
            const stats = calculateAttendanceStats(selectedStudent.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Attendance Summary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Attendance %" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-lg", children: [
                    stats.attendancePercentage,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Present Days" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: stats.presentDays })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Absent Days" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg text-red-600", children: stats.absentDays })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Current Streak" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-lg text-green-600", children: [
                    stats.currentStreak,
                    " days"
                  ] })
                ] })
              ] })
            ] });
          })(),
          (() => {
            const achievements = getAchievements(selectedStudent.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Achievements" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
                  achievements.length,
                  " total achievements"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: achievements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No achievements yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: achievements.map((achievement) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-4 border-yellow-500 pl-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: achievement.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: achievement.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: achievement.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-yellow-600", children: [
                    "+",
                    achievement.points,
                    " pts"
                  ] })
                ] })
              ] }, achievement.id)) }) })
            ] });
          })()
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 text-center text-muted-foreground", children: "Select a student to view their profile" }) }) })
      ] }),
      upcomingBirthdays.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-blue-700 dark:text-blue-300", children: "🎂 Upcoming Birthdays" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: upcomingBirthdays.map((student) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-950 p-3 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: student.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric"
          }) : "N/A" })
        ] }, student.id)) }) })
      ] })
    ] })
  ] });
}
export {
  StudentProfilesPage as component
};
