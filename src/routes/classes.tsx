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
import { Trash2, Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { classStorage } from "@/lib/storage";
import { generateId } from "@/lib/helpers";
import type { Class } from "@/lib/types";

export const Route = createFileRoute("/classes")({
  component: ClassesPage,
});

function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    section: "",
    capacity: 30,
    description: "",
    roomNumber: "",
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };

  const handleSave = () => {
    if (!formData.name || !formData.grade) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      classStorage.update(editingId, formData);
    } else {
      const newClass: Class = {
        id: generateId(),
        ...formData,
        createdAt: new Date().toISOString(),
        teachers: [],
      };
      classStorage.add(newClass);
    }

    resetForm();
    loadClasses();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      classStorage.delete(id);
      loadClasses();
    }
  };

  const handleEdit = (classData: Class) => {
    setFormData({
      name: classData.name,
      grade: classData.grade,
      section: classData.section,
      capacity: classData.capacity,
      description: classData.description,
      roomNumber: classData.roomNumber || "",
    });
    setEditingId(classData.id);
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      grade: "",
      section: "",
      capacity: 30,
      description: "",
      roomNumber: "",
    });
    setEditingId(null);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Manage Classes"
        description="View and manage all classes in your school."
        actions={
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Class" : "Add New Class"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Edit the class details" : "Create a new class"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Class Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., 10-A"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Grade *</Label>
                    <Input
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div>
                    <Label>Section</Label>
                    <Input
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      placeholder="e.g., A"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Room Number</Label>
                    <Input
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      placeholder="e.g., 101"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Class description"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Class</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-6">
        {classes.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No classes yet. Add your first class to get started.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
              <CardDescription>Total: {classes.length} classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell className="font-medium">{classItem.name}</TableCell>
                        <TableCell>{classItem.grade}</TableCell>
                        <TableCell>{classItem.section || "-"}</TableCell>
                        <TableCell>{classItem.capacity}</TableCell>
                        <TableCell>{classItem.roomNumber || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(classItem)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(classItem.id)}
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
