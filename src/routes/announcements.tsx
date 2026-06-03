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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { announcementStorage, classStorage } from "@/lib/storage";
import { generateId } from "@/lib/helpers";
import type { Announcement } from "@/lib/types";

export const Route = createFileRoute("/announcements")({
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info" as Announcement["type"],
    classId: "",
  });

  useEffect(() => {
    loadAnnouncements();
    loadClasses();
  }, []);

  const loadAnnouncements = () => {
    const allAnnouncements = announcementStorage.getAll();
    // Sort by creation date, newest first
    allAnnouncements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAnnouncements(allAnnouncements);
  };

  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert("Please fill all required fields");
      return;
    }

    const newAnnouncement: Announcement = {
      id: generateId(),
      ...formData,
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    announcementStorage.add(newAnnouncement);
    resetForm();
    loadAnnouncements();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      announcementStorage.delete(id);
      loadAnnouncements();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "info",
      classId: "",
    });
    setIsOpen(false);
  };

  const typeColors = {
    general: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
    urgent: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
    info: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
  };

  const typeIcons = {
    general: "📢",
    urgent: "🚨",
    info: "ℹ️",
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Announcements"
        description="Create and manage announcements for classes."
        actions={
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogDescription>
                  Create an announcement to notify teachers and students
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Announcement title"
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Class (optional)</Label>
                  <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="For all classes" />
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
                  <Label>Content *</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Announcement content"
                    rows={5}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Post Announcement</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-6">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No announcements yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className={announcement.type === "urgent" ? "border-red-300" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{typeIcons[announcement.type]}</span>
                        <CardTitle>{announcement.title}</CardTitle>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[announcement.type]}`}>
                          {announcement.type.toUpperCase()}
                        </span>
                      </div>
                      <CardDescription className="mt-1">
                        {announcement.classId
                          ? `For: ${classes.find((c) => c.id === announcement.classId)?.name || "Class"}`
                          : "For: All Classes"}{" "}
                        • {new Date(announcement.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
