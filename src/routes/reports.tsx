import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileJson, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { classStorage, studentStorage, attendanceStorage, achievementStorage } from "@/lib/storage";
import { calculateAttendanceStats, exportToCSV, formatDateString } from "@/lib/helpers";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportType, setReportType] = useState("attendance");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };

  const generateAttendanceReport = () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    const classData = classStorage.getById(selectedClass);
    const students = studentStorage.getByClass(selectedClass);
    const allRecords = attendanceStorage.getByClass(selectedClass);

    let filteredRecords = allRecords;
    if (dateFrom) filteredRecords = filteredRecords.filter((r) => r.date >= dateFrom);
    if (dateTo) filteredRecords = filteredRecords.filter((r) => r.date <= dateTo);

    const reportData = students.map((student) => {
      const records = filteredRecords.filter((r) => r.studentId === student.id);
      const stats = calculateAttendanceStats(student.id, selectedClass);

      return {
        "Roll Number": student.rollNumber,
        "Student Name": student.name,
        "Total Days": records.length,
        "Present": records.filter((r) => r.status === "present").length,
        "Absent": records.filter((r) => r.status === "absent").length,
        "Leave": records.filter((r) => r.status === "leave").length,
        "Late": records.filter((r) => r.status === "late").length,
        "Attendance %": stats.attendancePercentage,
      };
    });

    exportToCSV(reportData, `attendance-report-${classData?.name}`);
  };

  const generateAchievementReport = () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    const classData = classStorage.getById(selectedClass);
    const students = studentStorage.getByClass(selectedClass);
    const achievements = achievementStorage.getAll().filter((a) => a.classId === selectedClass);

    const reportData = students.map((student) => {
      const studentAchievements = achievements.filter((a) => a.studentId === student.id);
      const totalPoints = studentAchievements.reduce((sum, a) => sum + a.points, 0);

      return {
        "Roll Number": student.rollNumber,
        "Student Name": student.name,
        "Total Achievements": studentAchievements.length,
        "Total Points": totalPoints,
        "Academic": studentAchievements.filter((a) => a.category === "academic").length,
        "Sports": studentAchievements.filter((a) => a.category === "sports").length,
        "Cultural": studentAchievements.filter((a) => a.category === "cultural").length,
      };
    });

    exportToCSV(reportData, `achievement-report-${classData?.name}`);
  };

  const generateCombinedReport = () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    const classData = classStorage.getById(selectedClass);
    const students = studentStorage.getByClass(selectedClass);
    const achievements = achievementStorage.getAll().filter((a) => a.classId === selectedClass);

    const reportData = students.map((student) => {
      const stats = calculateAttendanceStats(student.id, selectedClass);
      const studentAchievements = achievements.filter((a) => a.studentId === student.id);
      const totalPoints = studentAchievements.reduce((sum, a) => sum + a.points, 0);

      return {
        "Roll Number": student.rollNumber,
        "Student Name": student.name,
        "Attendance %": stats.attendancePercentage,
        "Present": stats.presentDays,
        "Absent": stats.absentDays,
        "Achievements": studentAchievements.length,
        "Points": totalPoints,
      };
    });

    exportToCSV(reportData, `combined-report-${classData?.name}`);
  };

  const downloadJSON = () => {
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }

    const classData = classStorage.getById(selectedClass);
    const students = studentStorage.getByClass(selectedClass);
    const attendance = attendanceStorage.getByClass(selectedClass);
    const achievements = achievementStorage.getAll().filter((a) => a.classId === selectedClass);

    const data = {
      class: classData,
      students,
      attendance,
      achievements,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `class-report-${classData?.name}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Reports"
        description="Generate and view attendance reports in various formats."
      />

      <div className="p-6 space-y-6">
        {/* Report Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Select Class *</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div>
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Attendance Report
              </CardTitle>
              <CardDescription>
                Detailed attendance statistics for the selected class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Includes present, absent, leave, and late records for each student
              </p>
              <Button
                onClick={generateAttendanceReport}
                disabled={!selectedClass}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
            </CardContent>
          </Card>

          {/* Achievement Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Achievement Report
              </CardTitle>
              <CardDescription>
                Student achievements and points breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Shows total achievements by category and points earned
              </p>
              <Button
                onClick={generateAchievementReport}
                disabled={!selectedClass}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
            </CardContent>
          </Card>

          {/* Combined Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Combined Report
              </CardTitle>
              <CardDescription>
                Comprehensive student performance summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Attendance and achievements data in a single report
              </p>
              <Button
                onClick={generateCombinedReport}
                disabled={!selectedClass}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
            </CardContent>
          </Card>

          {/* JSON Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                JSON Export
              </CardTitle>
              <CardDescription>
                Complete data in JSON format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Export all class data including students, attendance, and achievements
              </p>
              <Button
                onClick={downloadJSON}
                disabled={!selectedClass}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
