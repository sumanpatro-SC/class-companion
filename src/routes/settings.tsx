import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { settingsStorage, clearAllStorage } from "@/lib/storage";
import type { Settings } from "@/lib/types";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentSettings = settingsStorage.getSettings();
    setSettings(currentSettings);
  }, []);

  const handleSave = () => {
    if (settings) {
      setIsLoading(true);
      try {
        settingsStorage.updateSettings(settings);
        alert("Settings saved successfully!");
      } catch (error) {
        alert("Error saving settings: " + error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = () => {
    try {
      // Get all data from localStorage
      const allData = {
        students: localStorage.getItem("cc_students"),
        classes: localStorage.getItem("cc_classes"),
        attendance: localStorage.getItem("cc_attendance"),
        leaves: localStorage.getItem("cc_leaves"),
        holidays: localStorage.getItem("cc_holidays"),
        announcements: localStorage.getItem("cc_announcements"),
        achievements: localStorage.getItem("cc_achievements"),
        seatArrangements: localStorage.getItem("cc_seat_arrangements"),
        settings: localStorage.getItem("cc_settings"),
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(allData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `class-companion-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Data exported successfully!");
    } catch (error) {
      alert("Error exporting data: " + error);
    }
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Restore data
        if (data.students) localStorage.setItem("cc_students", data.students);
        if (data.classes) localStorage.setItem("cc_classes", data.classes);
        if (data.attendance) localStorage.setItem("cc_attendance", data.attendance);
        if (data.leaves) localStorage.setItem("cc_leaves", data.leaves);
        if (data.holidays) localStorage.setItem("cc_holidays", data.holidays);
        if (data.announcements) localStorage.setItem("cc_announcements", data.announcements);
        if (data.achievements) localStorage.setItem("cc_achievements", data.achievements);
        if (data.seatArrangements) localStorage.setItem("cc_seat_arrangements", data.seatArrangements);
        if (data.settings) localStorage.setItem("cc_settings", data.settings);

        alert("Data imported successfully! Please refresh the page.");
        window.location.reload();
      } catch (error) {
        alert("Error importing data: " + error);
      }
    };
    input.click();
  };

  const handleClearAllData = () => {
    if (confirm("⚠️ This will delete ALL data. Are you absolutely sure? This cannot be undone.")) {
      if (confirm("⚠️ Are you really sure? This will delete everything!")) {
        clearAllStorage();
        alert("All data has been cleared.");
        window.location.reload();
      }
    }
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Settings"
        description="Configure application settings and preferences."
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* School Information */}
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>Basic information about your school</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>School Name</Label>
              <Input
                value={settings.schoolName}
                onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
              />
            </div>
            <div>
              <Label>School Address</Label>
              <Input
                value={settings.schoolAddress || ""}
                onChange={(e) => setSettings({ ...settings, schoolAddress: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>School Phone</Label>
                <Input
                  value={settings.schoolPhone || ""}
                  onChange={(e) => setSettings({ ...settings, schoolPhone: e.target.value })}
                />
              </div>
              <div>
                <Label>School Email</Label>
                <Input
                  type="email"
                  value={settings.schoolEmail || ""}
                  onChange={(e) => setSettings({ ...settings, schoolEmail: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Settings</CardTitle>
            <CardDescription>Configure attendance thresholds and marking options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Attendance Percentage Threshold (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.attendancePercentageThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      attendancePercentageThreshold: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum attendance percentage required
                </p>
              </div>
              <div>
                <Label>Low Attendance Alert Threshold (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.lowAttendanceAlertThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      lowAttendanceAlertThreshold: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Show alert for students below this percentage
                </p>
              </div>
            </div>
            <div>
              <Label>Marking Deadline (Hours)</Label>
              <Input
                type="number"
                min="1"
                value={settings.markingDeadlineHours}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    markingDeadlineHours: parseInt(e.target.value),
                  })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Hours within which attendance must be marked
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Theme & Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Theme</Label>
              <Select value={settings.theme} onValueChange={(value: any) => setSettings({ ...settings, theme: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Default Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Default Settings</CardTitle>
            <CardDescription>Set defaults for new entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default Teacher Name</Label>
              <Input
                value={settings.defaultTeacherName}
                onChange={(e) => setSettings({ ...settings, defaultTeacherName: e.target.value })}
                placeholder="Administrator"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export, import, or clear all data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button
                variant="outline"
                onClick={handleImportData}
              >
                Import Data
              </Button>
              <Button
                variant="outline"
                onClick={handleClearAllData}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use Export to backup your data and Import to restore it. Clear All Data will permanently delete everything.
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
