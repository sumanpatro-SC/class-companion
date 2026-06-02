import { createFileRoute } from "@tanstack/react-router";
import { AttendanceApp } from "@/components/attendance/AttendanceApp";
import "@/components/attendance/attendance.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AttendanceMS — Google Sheets Attendance Manager" },
      { name: "description", content: "Mark, track, and export class attendance backed by any public Google Sheet." },
      { property: "og:title", content: "AttendanceMS — Attendance Manager" },
      { property: "og:description", content: "Mark, track, and export class attendance backed by any public Google Sheet." },
    ],
  }),
  component: AttendanceApp,
});