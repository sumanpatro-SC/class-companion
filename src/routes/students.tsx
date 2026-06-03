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
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { studentStorage, classStorage } from "@/lib/storage";
import { generateId } from "@/lib/helpers";
import type { Student } from "@/lib/types";

export const Route = createFileRoute("/students")({
  component: StudentsPage,
});

function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    parentName: "",
    parentPhone: "",
    address: "",
    classId: "",
  });

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  const loadStudents = () => {
    setStudents(studentStorage.getAll());
  };

  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.name || !formData.rollNumber || !formData.classId) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      studentStorage.update(editingId, formData);
    } else {
      const newStudent: Student = {
        id: generateId(),
        ...formData,
        joinDate: new Date().toISOString().split("T")[0],
        isActive: true,
      };
      studentStorage.add(newStudent);
    }

    resetForm();
    loadStudents();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      studentStorage.delete(id);
      loadStudents();
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      address: student.address,
      classId: student.classId,
    });
    setEditingId(student.id);
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      rollNumber: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      parentName: "",
      parentPhone: "",
      address: "",
      classId: "",
    });
    setEditingId(null);
    setIsOpen(false);
  };

  const getClassName = (classId: string) => {
    return classes.find((c) => c.id === classId)?.name || "Unknown";
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Manage Students"
        description="View and manage all students."
        actions={
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Student" : "Add New Student"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Edit the student details" : "Create a new student record"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Student name"
                    />
                  </div>
                  <div>
                    <Label>Roll Number *</Label>
                    <Input
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      placeholder="e.g., A01"
                    />
                  </div>
                </div>

                <div>
                  <Label>Class *</Label>
                  <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Parent Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Parent Name</Label>
                      <Input
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="Parent/Guardian name"
                      />
                    </div>
                    <div>
                      <Label>Parent Phone</Label>
                      <Input
                        value={formData.parentPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, parentPhone: e.target.value })
                        }
                        placeholder="Parent phone"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Student address"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Student</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, roll number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {students.length === 0
                ? "No students yet. Add your first student to get started."
                : "No students match your search."}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Total: {filteredStudents.length} students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll #</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Parent Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{getClassName(student.classId)}</TableCell>
                        <TableCell>{student.email || "-"}</TableCell>
                        <TableCell>{student.parentPhone || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(student.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
