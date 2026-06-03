import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { classStorage, studentStorage, attendanceStorage } from "@/lib/storage";
import { calculateAttendanceStats, calculateStudentRankings, getLowAttendanceAlerts } from "@/lib/helpers";
import type { Student } from "@/lib/types";

export const Route = createFileRoute("/analytics")({
  component: AttendanceAnalyticsPage,
});

function AttendanceAnalyticsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [lowAttendance, setLowAttendance] = useState<any[]>([]);

  useEffect(() => {
    loadClasses();
    calculateGlobalAnalytics();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
      calculateClassAnalytics();
    }
  }, [selectedClass]);

  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };

  const loadStudents = () => {
    if (selectedClass) {
      const classStudents = studentStorage.getByClass(selectedClass);
      setStudents(classStudents);
    }
  };

  const calculateGlobalAnalytics = () => {
    const allRecords = attendanceStorage.getAll();
    const allStudents = studentStorage.getAll();
    const allRankings = calculateStudentRankings();
    const lowAtt = getLowAttendanceAlerts(75);

    const totalRecords = allRecords.length;
    const presentCount = allRecords.filter((r) => r.status === "present").length;
    const absentCount = allRecords.filter((r) => r.status === "absent").length;

    setAnalyticsData({
      totalRecords,
      presentCount,
      absentCount,
      studentCount: allStudents.length,
      presentPercentage: totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0,
    });

    setRankings(allRankings.slice(0, 10));
    setLowAttendance(lowAtt);
  };

  const calculateClassAnalytics = () => {
    if (!selectedClass) return;

    const records = attendanceStorage.getByClass(selectedClass);
    const classStudents = studentStorage.getByClass(selectedClass);
    const classRankings = calculateStudentRankings(selectedClass);

    setRankings(classRankings);

    // Calculate daily attendance trend
    const dailyData: Record<string, { date: string; present: number; absent: number; leave: number; late: number }> = {};

    records.forEach((record) => {
      if (!dailyData[record.date]) {
        dailyData[record.date] = { date: record.date, present: 0, absent: 0, leave: 0, late: 0 };
      }
      dailyData[record.date][record.status as keyof typeof dailyData[string]]++;
    });

    const trendData = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate student-wise attendance
    const studentAttendance = classStudents.map((student) => {
      const stats = calculateAttendanceStats(student.id, selectedClass);
      return {
        name: student.rollNumber || student.name.substring(0, 3),
        percentage: stats.attendancePercentage,
      };
    });

    setAnalyticsData({
      trendData,
      studentAttendance,
      totalRecords: records.length,
      presentCount: records.filter((r) => r.status === "present").length,
      absentCount: records.filter((r) => r.status === "absent").length,
      leaveCount: records.filter((r) => r.status === "leave").length,
      lateCount: records.filter((r) => r.status === "late").length,
    });
  };

  const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6"];

  const statusData = analyticsData
    ? [
        { name: "Present", value: analyticsData.presentCount, color: "#10b981" },
        { name: "Absent", value: analyticsData.absentCount, color: "#ef4444" },
        { name: "Leave", value: analyticsData.leaveCount || 0, color: "#f59e0b" },
        { name: "Late", value: analyticsData.lateCount || 0, color: "#3b82f6" },
      ]
    : [];

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Attendance Analytics"
        description="View detailed attendance analytics and insights."
      />

      <div className="p-6 space-y-6">
        {/* Class Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select a class for detailed analytics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {analyticsData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.totalRecords}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Present</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {analyticsData.presentCount}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {analyticsData.absentCount}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Attendance %</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {analyticsData.presentPercentage || analyticsData.presentPercentage === 0
                    ? `${analyticsData.presentPercentage}%`
                    : "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Status Pie Chart */}
          {statusData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attendance Status Distribution</CardTitle>
                <CardDescription>Overall attendance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Top Rankings */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Students</CardTitle>
              <CardDescription>Ranked by attendance and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {rankings.slice(0, 10).map((ranking) => (
                  <div key={ranking.studentId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">#{ranking.rank}</p>
                      <p className="text-xs text-muted-foreground">{ranking.studentName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{ranking.attendancePercentage}%</p>
                      <p className="text-xs text-muted-foreground">{ranking.totalPoints} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Trend Chart */}
        {analyticsData?.trendData && analyticsData.trendData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
              <CardDescription>Daily attendance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" stackId="a" fill="#10b981" name="Present" />
                  <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
                  <Bar dataKey="leave" stackId="a" fill="#f59e0b" name="Leave" />
                  <Bar dataKey="late" stackId="a" fill="#3b82f6" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Student Attendance Bar Chart */}
        {analyticsData?.studentAttendance && analyticsData.studentAttendance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance Percentage</CardTitle>
              <CardDescription>Individual student attendance rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.studentAttendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="percentage" fill="#3b82f6" name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Low Attendance Alert */}
        {lowAttendance.length > 0 && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300">Low Attendance Alerts</CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                {lowAttendance.length} students below 75% attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {lowAttendance.map((alert) => (
                  <div
                    key={alert.student.id}
                    className="flex items-center justify-between text-sm p-2 bg-white/50 dark:bg-black/20 rounded"
                  >
                    <span>{alert.student.name}</span>
                    <span className="font-semibold">{alert.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
