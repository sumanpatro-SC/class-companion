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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { studentStorage, classStorage, attendanceStorage, holidayStorage } from "@/lib/storage";
import { generateId, isHoliday, formatDateString } from "@/lib/helpers";
import type { Student, AttendanceRecord } from "@/lib/types";

export const Route = createFileRoute("/attendance/mark")({
  component: MarkAttendancePage,
});

function MarkAttendancePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "leave" | "late">>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
      loadAttendance();
    }
  }, [selectedClass, selectedDate]);

  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };

  const loadStudents = () => {
    if (selectedClass) {
      const classStudents = studentStorage.getByClass(selectedClass);
      setStudents(classStudents);

      // Initialize attendance state
      const attendanceMap: Record<string, string> = {};
      classStudents.forEach((student) => {
        attendanceMap[student.id] = "present";
      });
      setAttendance(attendanceMap);
    }
  };

  const loadAttendance = () => {
    if (selectedClass) {
      const existingRecords = attendanceStorage.getByClass(selectedClass, selectedDate);
      const attendanceMap: Record<string, string> = {};
      const remarksMap: Record<string, string> = {};

      existingRecords.forEach((record) => {
        attendanceMap[record.studentId] = record.status;
        if (record.remarks) {
          remarksMap[record.studentId] = record.remarks;
        }
      });

      setAttendance(attendanceMap);
      setRemarks(remarksMap);
    }
  };

  const handleSave = async () => {
    if (!selectedClass || !selectedDate) {
      alert("Please select class and date");
      return;
    }

    const holiday = isHoliday(selectedDate);
    if (holiday) {
      alert(`This date is marked as a holiday: ${holiday.name}`);
      return;
    }

    setIsLoading(true);

    try {
      // Delete existing records for this class and date
      const existing = attendanceStorage.getByClass(selectedClass, selectedDate);
      existing.forEach((record) => {
        attendanceStorage.delete(record.id);
      });

      // Add new records
      const newRecords: AttendanceRecord[] = Object.entries(attendance).map(([studentId, status]) => ({
        id: generateId(),
        studentId,
        classId: selectedClass,
        date: selectedDate,
        status: status as "present" | "absent" | "leave" | "late",
        remarks: remarks[studentId] || undefined,
        markedAt: new Date().toISOString(),
        markedBy: "Admin",
      }));

      attendanceStorage.addBulk(newRecords);

      alert("Attendance marked successfully!");
      loadAttendance();
    } catch (error) {
      alert("Error saving attendance: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAll = (status: "present" | "absent" | "leave" | "late") => {
    const newAttendance: Record<string, string> = {};
    students.forEach((student) => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const statusColors = {
    present: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
    absent: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
    leave: "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300",
    late: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
  };

  const holiday = isHoliday(selectedDate);

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Mark Attendance"
        description="Mark attendance for students."
      />

      <div className="p-6 space-y-6">
        {holiday && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <CardContent className="pt-6">
              <p className="text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>{holiday.name}</strong> is marked as a holiday. Attendance cannot be marked for this date.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Select Class & Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Class</Label>
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
                <Label>Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={holiday !== null}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={() => markAll("present")} className="flex-1">
                  Mark All Present
                </Button>
                <Button variant="outline" onClick={() => markAll("absent")} className="flex-1">
                  Mark All Absent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {students.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Attendance - {classes.find((c) => c.id === selectedClass)?.name || ""} - {formatDateString(selectedDate)}
              </CardTitle>
              <CardDescription>
                {students.length} students total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.rollNumber}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <Select
                            value={attendance[student.id] || "present"}
                            onValueChange={(value) =>
                              setAttendance({
                                ...attendance,
                                [student.id]: value as "present" | "absent" | "leave" | "late",
                              })
                            }
                            disabled={holiday !== null}
                          >
                            <SelectTrigger className={`w-32 ${statusColors[attendance[student.id] as keyof typeof statusColors] || statusColors.present}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">
                                <span className="flex items-center gap-2">
                                  <Check className="h-4 w-4" /> Present
                                </span>
                              </SelectItem>
                              <SelectItem value="absent">
                                <span className="flex items-center gap-2">
                                  <X className="h-4 w-4" /> Absent
                                </span>
                              </SelectItem>
                              <SelectItem value="leave">
                                <span className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" /> Leave
                                </span>
                              </SelectItem>
                              <SelectItem value="late">
                                <span className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" /> Late
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Remarks"
                            value={remarks[student.id] || ""}
                            onChange={(e) =>
                              setRemarks({
                                ...remarks,
                                [student.id]: e.target.value,
                              })
                            }
                            disabled={holiday !== null}
                            className="w-48"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => loadAttendance()}
                >
                  Reset
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || holiday !== null}
                >
                  {isLoading ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedClass && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Select a class to view students and mark attendance
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
