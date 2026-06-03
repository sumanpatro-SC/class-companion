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
import { useEffect, useState } from "react";
import { classStorage, studentStorage, seatArrangementStorage } from "@/lib/storage";
import { generateId } from "@/lib/helpers";

export const Route = createFileRoute("/seating")({
  component: SeatArrangementPage,
});

function SeatArrangementPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(6);
  const [seatMap, setSeatMap] = useState<Record<string, any>>({});

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
      loadSeating();
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

  const loadSeating = () => {
    if (selectedClass) {
      const arrangements = seatArrangementStorage.getByClass(selectedClass);
      const map: Record<string, any> = {};
      arrangements.forEach((arr) => {
        map[`${arr.row}-${arr.column}`] = arr;
      });
      setSeatMap(map);
    }
  };

  const handleSeatClick = (row: number, col: number) => {
    const seatKey = `${row}-${col}`;
    const availableStudents = students.filter(
      (s) => !Object.values(seatMap).some((seat: any) => seat.studentId === s.id)
    );

    if (!availableStudents.length) {
      alert("All students are already seated");
      return;
    }

    // Simple assignment - just assign next available student
    if (!seatMap[seatKey]) {
      const student = availableStudents[0];
      const arrangement = {
        id: generateId(),
        classId: selectedClass,
        studentId: student.id,
        row,
        column: col,
        updatedAt: new Date().toISOString(),
      };

      seatArrangementStorage.add(arrangement);
      setSeatMap({
        ...seatMap,
        [seatKey]: arrangement,
      });
    }
  };

  const handleClearSeat = (row: number, col: number) => {
    const seatKey = `${row}-${col}`;
    const arrangement = seatMap[seatKey];

    if (arrangement) {
      seatArrangementStorage.delete(arrangement.id);
      const newMap = { ...seatMap };
      delete newMap[seatKey];
      setSeatMap(newMap);
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all seats?")) {
      Object.values(seatMap).forEach((arr: any) => {
        seatArrangementStorage.delete(arr.id);
      });
      setSeatMap({});
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.rollNumber || student.name.substring(0, 6) : "?";
  };

  const getSeatedStudents = () => {
    return Object.values(seatMap).length;
  };

  const getAvailableStudents = () => {
    return students.filter(
      (s) => !Object.values(seatMap).some((seat: any) => seat.studentId === s.id)
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Seat Arrangement"
        description="Manage student seating arrangements."
      />

      <div className="p-6 space-y-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Classroom Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Select Class</Label>
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
                <Label>Number of Rows</Label>
                <Input
                  type="number"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <Label>Number of Columns</Label>
                <Input
                  type="number"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                  min="1"
                  max="10"
                />
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={handleClearAll} className="w-full">
                  Clear All Seats
                </Button>
              </div>
            </div>

            {selectedClass && (
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium">
                  Seated: <span className="text-green-600">{getSeatedStudents()}</span> / {students.length}
                </span>
                <span className="text-muted-foreground">
                  Capacity: {rows * cols}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedClass && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Seating Chart */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Classroom Layout</CardTitle>
                  <CardDescription>Click on seats to assign students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <div className="inline-block border-4 border-yellow-600 rounded-lg p-4 bg-yellow-100 dark:bg-yellow-900/30">
                      <div className="mb-4 text-center text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                        BOARD
                      </div>
                      <div className="space-y-2">
                        {Array.from({ length: rows }).map((_, row) => (
                          <div key={row} className="flex gap-2">
                            {Array.from({ length: cols }).map((_, col) => {
                              const seatKey = `${row}-${col}`;
                              const arrangement = seatMap[seatKey];
                              return (
                                <button
                                  key={`${row}-${col}`}
                                  onClick={() =>
                                    arrangement
                                      ? handleClearSeat(row, col)
                                      : handleSeatClick(row, col)
                                  }
                                  className={`w-16 h-16 rounded border-2 font-medium text-sm flex items-center justify-center cursor-pointer transition-all ${
                                    arrangement
                                      ? "bg-blue-500 text-white border-blue-600 hover:bg-red-500"
                                      : "bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                                  }`}
                                  title={arrangement ? `Click to remove ${getStudentName(arrangement.studentId)}` : "Click to assign"}
                                >
                                  {arrangement ? (
                                    getStudentName(arrangement.studentId)
                                  ) : (
                                    <span className="text-gray-400">Empty</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Students */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Unassigned Students</CardTitle>
                  <CardDescription>
                    {getAvailableStudents().length} remaining
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {getAvailableStudents().length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        All students seated!
                      </p>
                    ) : (
                      getAvailableStudents().map((student) => (
                        <div
                          key={student.id}
                          className="p-2 bg-gray-100 dark:bg-slate-800 rounded text-sm"
                        >
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.rollNumber}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!selectedClass && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Select a class to arrange student seating
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
