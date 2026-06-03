import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { achievementStorage, studentStorage, classStorage } from "@/lib/storage";
import { generateId } from "@/lib/helpers";
import type { Achievement } from "@/lib/types";

export const Route = createFileRoute("/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [formData, setFormData] = useState({
    studentId: "",
    title: "",
    description: "",
    category: "academic" as Achievement["category"],
    points: 10,
  });

  useEffect(() => {
    loadClasses();
    loadAchievements();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
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

  const loadAchievements = () => {
    const allAchievements = achievementStorage.getAll();
    allAchievements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setAchievements(allAchievements);
  };

  const handleSave = () => {
    if (!formData.studentId || !formData.title) {
      alert("Please fill all required fields");
      return;
    }

    const student = studentStorage.getById(formData.studentId);
    if (!student) {
      alert("Student not found");
      return;
    }

    const newAchievement: Achievement = {
      id: generateId(),
      ...formData,
      classId: student.classId,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    achievementStorage.add(newAchievement);
    resetForm();
    loadAchievements();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      achievementStorage.delete(id);
      loadAchievements();
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      title: "",
      description: "",
      category: "academic",
      points: 10,
    });
    setSelectedClass("");
    setIsOpen(false);
  };

  const getStudentName = (studentId: string) => {
    return studentStorage.getById(studentId)?.name || "Unknown";
  };

  const categoryColors = {
    academic: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
    sports: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100",
    cultural: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100",
    behavioral: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
    other: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100",
  };

  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Achievements"
        description="Manage student achievements and awards."
        actions={
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Achievement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Achievement</DialogTitle>
                <DialogDescription>
                  Record a student achievement or award
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
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
                  <Label>Student *</Label>
                  <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value })} disabled={!selectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Science Olympiad Winner"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Achievement details"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Points</Label>
                    <Input
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Achievement</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{achievements.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Points Awarded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{totalPoints}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Students Rewarded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Set(achievements.map((a) => a.studentId)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Table */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements List</CardTitle>
            <CardDescription>All recorded achievements</CardDescription>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No achievements recorded yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {achievements.map((achievement) => (
                      <TableRow key={achievement.id}>
                        <TableCell className="font-medium">
                          {getStudentName(achievement.studentId)}
                        </TableCell>
                        <TableCell>{achievement.title}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[achievement.category]}`}>
                            {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-yellow-600">+{achievement.points}</span>
                        </TableCell>
                        <TableCell>{achievement.date}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(achievement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
