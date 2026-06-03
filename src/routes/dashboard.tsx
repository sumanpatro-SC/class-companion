import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CheckSquare, AlertCircle, Trophy, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  classStorage,
  studentStorage,
  attendanceStorage,
  achievementStorage,
} from "@/lib/storage";
import { calculateStudentRankings, getLowAttendanceAlerts } from "@/lib/helpers";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAttendanceRecords: 0,
    totalAchievements: 0,
    topRankings: [] as any[],
    lowAttendanceCount: 0,
  });

  useEffect(() => {
    const classes = classStorage.getAll();
    const students = studentStorage.getAll();
    const attendance = attendanceStorage.getAll();
    const achievements = achievementStorage.getAll();
    const rankings = calculateStudentRankings();
    const lowAttendance = getLowAttendanceAlerts(75);

    setStats({
      totalClasses: classes.length,
      totalStudents: students.length,
      totalAttendanceRecords: attendance.length,
      totalAchievements: achievements.length,
      topRankings: rankings.slice(0, 5),
      lowAttendanceCount: lowAttendance.length,
    });
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your school's attendance and performance."
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Classes"
            value={stats.totalClasses}
            icon={BookOpen}
            color="text-blue-500"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            color="text-green-500"
          />
          <StatCard
            title="Attendance Records"
            value={stats.totalAttendanceRecords}
            icon={CheckSquare}
            color="text-purple-500"
          />
          <StatCard
            title="Achievements"
            value={stats.totalAchievements}
            icon={Trophy}
            color="text-yellow-500"
          />
        </div>

        {/* Alerts and Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Attendance Alert */}
          {stats.lowAttendanceCount > 0 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  Low Attendance Alert
                </CardTitle>
                <CardDescription className="text-red-600/70 dark:text-red-400/70">
                  {stats.lowAttendanceCount} students need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full">
                  <a href="/analytics">View Details</a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Top Rankings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Rankings
              </CardTitle>
              <CardDescription>Best performing students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topRankings.length > 0 ? (
                  stats.topRankings.map((ranking) => (
                    <div key={ranking.studentId} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{ranking.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          Rank #{ranking.rank}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{ranking.attendancePercentage}%</p>
                        <p className="text-xs text-muted-foreground">
                          {ranking.totalPoints} points
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" asChild>
                <a href="/attendance/mark">Mark Attendance</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/students">Add Student</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/classes">Add Class</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/announcements">New Announcement</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">{value}</div>
          <Icon className={`h-8 w-8 ${color} opacity-70`} />
        </div>
      </CardContent>
    </Card>
  );
}
