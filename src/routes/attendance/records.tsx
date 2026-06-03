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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { studentStorage, classStorage, attendanceStorage } from "@/lib/storage";
import { calculateAttendanceStats, exportToCSV, formatDateString } from "@/lib/helpers";

export const Route = createFileRoute("/attendance/records")({
  component: AttendanceRecordsPage,
});

function AttendanceRecordsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  useEffect(() => {
    applyFilters();
  }, [selectedClass, selectedStudent, dateFrom, dateTo]);

  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };

  const loadStudents = () => {
    if (selectedClass) {
      const classStudents = studentStorage.getByClass(selectedClass);
      setStudents(classStudents);
    }
  };

  const applyFilters = () => {
    let allRecords = attendanceStorage.getAll();

    if (selectedClass) {
      allRecords = allRecords.filter((r) => r.classId === selectedClass);
    }

    if (selectedStudent) {
      allRecords = allRecords.filter((r) => r.studentId === selectedStudent);
    }

    if (dateFrom) {
      allRecords = allRecords.filter((r) => r.date >= dateFrom);
    }

    if (dateTo) {
      allRecords = allRecords.filter((r) => r.date <= dateTo);
    }

    // Sort by date descending
    allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setRecords(allRecords);
  };

  const getClassName = (classId: string) => {
    return classes.find((c) => c.id === classId)?.name || "Unknown";
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) {
      // Search in all students
      const allStudents = studentStorage.getAll();
      return allStudents.find((s) => s.id === studentId)?.name || "Unknown";
    }
    return student.name;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
      case "absent":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
      case "leave":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
      case "late":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100";
      default:
        return "";
    }
  };

  const handleExport = () => {
    if (records.length === 0) {
      alert("No records to export");
      return;
    }

    const exportData = records.map((r) => ({
      Date: formatDateString(r.date),
      Student: getStudentName(r.studentId),
      Class: getClassName(r.classId),
      Status: r.status.toUpperCase(),
      Remarks: r.remarks || "",
      "Marked At": new Date(r.markedAt).toLocaleString(),
    }));

    exportToCSV(exportData, "attendance-records");
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Attendance Records"
        description="View attendance records and history."
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
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
              </div>

              <div>
                <label className="text-sm font-medium">Student</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={!selectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Students</SelectItem>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">From Date</label>
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">To Date</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedClass("");
                    setSelectedStudent("");
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="w-full"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>Total records: {records.length}</CardDescription>
              </div>
              <Button onClick={handleExport} disabled={records.length === 0} className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No attendance records found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Marked At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDateString(record.date)}</TableCell>
                        <TableCell>{getStudentName(record.studentId)}</TableCell>
                        <TableCell>{getClassName(record.classId)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.status)}`}>
                            {record.status.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>{record.remarks || "-"}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(record.markedAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
