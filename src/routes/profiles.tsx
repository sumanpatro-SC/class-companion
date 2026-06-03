import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { studentStorage, classStorage, achievementStorage } from "@/lib/storage";
import { calculateAttendanceStats, getBirthdayReminders } from "@/lib/helpers";
import type { Student } from "@/lib/types";

export const Route = createFileRoute("/profiles")({
  component: StudentProfilesPage,
});

function StudentProfilesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    setStudents(studentStorage.getAll());
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClassName = (classId: string) => {
    return classStorage.getById(classId)?.name || "Unknown";
  };

  const getAchievements = (studentId: string) => {
    return achievementStorage.getByStudent(studentId);
  };

  const upcomingBirthdays = getBirthdayReminders(7);

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Student Profiles"
        description="View detailed student profiles and information."
      />

      <div className="p-6 space-y-6">
        {/* Search and List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        selectedStudent?.id === student.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="space-y-4">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedStudent.name}</CardTitle>
                    <CardDescription>{getClassName(selectedStudent.classId)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Roll Number</p>
                        <p className="font-medium">{selectedStudent.rollNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedStudent.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedStudent.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">DOB</p>
                        <p className="font-medium">{selectedStudent.dateOfBirth || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Parent Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Parent/Guardian Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedStudent.parentName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedStudent.parentPhone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedStudent.address || "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Attendance Summary */}
                {(() => {
                  const stats = calculateAttendanceStats(selectedStudent.id);
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Attendance Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Attendance %</p>
                          <p className="font-bold text-lg">{stats.attendancePercentage}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Present Days</p>
                          <p className="font-bold text-lg">{stats.presentDays}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Absent Days</p>
                          <p className="font-bold text-lg text-red-600">{stats.absentDays}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Current Streak</p>
                          <p className="font-bold text-lg text-green-600">{stats.currentStreak} days</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}

                {/* Achievements */}
                {(() => {
                  const achievements = getAchievements(selectedStudent.id);
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Achievements</CardTitle>
                        <CardDescription>{achievements.length} total achievements</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {achievements.length === 0 ? (
                          <p className="text-muted-foreground text-sm">No achievements yet</p>
                        ) : (
                          <div className="space-y-3">
                            {achievements.map((achievement) => (
                              <div key={achievement.id} className="border-l-4 border-yellow-500 pl-4">
                                <p className="font-medium">{achievement.title}</p>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-xs">{achievement.category}</p>
                                  <p className="text-sm font-semibold text-yellow-600">+{achievement.points} pts</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })()}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Select a student to view their profile
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Upcoming Birthdays */}
        {upcomingBirthdays.length > 0 && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-700 dark:text-blue-300">🎂 Upcoming Birthdays</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {upcomingBirthdays.map((student) => (
                  <div key={student.id} className="bg-white dark:bg-slate-950 p-3 rounded">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.dateOfBirth
                        ? new Date(student.dateOfBirth).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
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
