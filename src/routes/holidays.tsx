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
import { Trash2, Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { holidayStorage } from "@/lib/storage";
import { generateId, formatDateString } from "@/lib/helpers";
import type { Holiday } from "@/lib/types";

export const Route = createFileRoute("/holidays")({
  component: HolidaysPage,
});

function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    type: "national" as Holiday["type"],
    description: "",
  });

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = () => {
    const allHolidays = holidayStorage.getAll();
    // Sort by date
    allHolidays.sort((a, b) => a.date.localeCompare(b.date));
    setHolidays(allHolidays);
  };

  const handleSave = () => {
    if (!formData.name || !formData.date) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      holidayStorage.update(editingId, formData);
    } else {
      const newHoliday: Holiday = {
        id: generateId(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      holidayStorage.add(newHoliday);
    }

    resetForm();
    loadHolidays();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this holiday?")) {
      holidayStorage.delete(id);
      loadHolidays();
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setFormData({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      description: holiday.description || "",
    });
    setEditingId(holiday.id);
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      type: "national",
      description: "",
    });
    setEditingId(null);
    setIsOpen(false);
  };

  const typeColors = {
    national: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
    school: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100",
    cultural: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100",
    other: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100",
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Holidays"
        description="Manage holidays and special days."
        actions={
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Holiday" : "Add New Holiday"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Edit the holiday details" : "Create a new holiday entry"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Holiday Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Independence Day"
                  />
                </div>

                <div>
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Holiday description"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Holiday</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-6">
        {holidays.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No holidays yet. Add your first holiday to get started.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Holidays</CardTitle>
              <CardDescription>Total: {holidays.length} holidays</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holidays.map((holiday) => (
                      <TableRow key={holiday.id}>
                        <TableCell className="font-medium">{holiday.name}</TableCell>
                        <TableCell>{formatDateString(holiday.date)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[holiday.type]}`}>
                            {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{holiday.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(holiday)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(holiday.id)}
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
