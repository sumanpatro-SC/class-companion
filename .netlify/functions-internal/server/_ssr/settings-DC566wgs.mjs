import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as settingsStorage, P as PageHeader, C as Card, b as CardHeader, d as CardTitle, e as CardDescription, a as CardContent, g as clearAllStorage } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { L as Label } from "./label-BIiCNsEU.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1dML0qAS.mjs";
import { D as Download, i as Trash2 } from "../_libs/lucide-react.mjs";
import "./router-DsChniCp.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
function SettingsPage() {
  const [settings, setSettings] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
        exportDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      const dataStr = JSON.stringify(allData, null, 2);
      const blob = new Blob([dataStr], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `class-companion-backup-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
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
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Loading..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Settings", description: "Configure application settings and preferences." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 max-w-4xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "School Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Basic information about your school" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "School Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: settings.schoolName, onChange: (e) => setSettings({
              ...settings,
              schoolName: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "School Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: settings.schoolAddress || "", onChange: (e) => setSettings({
              ...settings,
              schoolAddress: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "School Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: settings.schoolPhone || "", onChange: (e) => setSettings({
                ...settings,
                schoolPhone: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "School Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: settings.schoolEmail || "", onChange: (e) => setSettings({
                ...settings,
                schoolEmail: e.target.value
              }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Attendance Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure attendance thresholds and marking options" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Attendance Percentage Threshold (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", max: "100", value: settings.attendancePercentageThreshold, onChange: (e) => setSettings({
                ...settings,
                attendancePercentageThreshold: parseInt(e.target.value)
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Minimum attendance percentage required" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Low Attendance Alert Threshold (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", max: "100", value: settings.lowAttendanceAlertThreshold, onChange: (e) => setSettings({
                ...settings,
                lowAttendanceAlertThreshold: parseInt(e.target.value)
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Show alert for students below this percentage" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Marking Deadline (Hours)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "1", value: settings.markingDeadlineHours, onChange: (e) => setSettings({
              ...settings,
              markingDeadlineHours: parseInt(e.target.value)
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Hours within which attendance must be marked" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Appearance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Customize the look and feel" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Theme" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: settings.theme, onValueChange: (value) => setSettings({
            ...settings,
            theme: value
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "dark", children: "Dark" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "light", children: "Light" })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Default Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Set defaults for new entries" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Default Teacher Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: settings.defaultTeacherName, onChange: (e) => setSettings({
            ...settings,
            defaultTeacherName: e.target.value
          }), placeholder: "Administrator" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Data Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Export, import, or clear all data" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleExportData, className: "gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              "Export Data"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: handleImportData, children: "Import Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleClearAllData, className: "text-red-600 hover:text-red-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-2 h-4 w-4" }),
              "Clear All Data"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use Export to backup your data and Import to restore it. Clear All Data will permanently delete everything." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, disabled: isLoading, size: "lg", children: isLoading ? "Saving..." : "Save Settings" }) })
    ] })
  ] });
}
export {
  SettingsPage as component
};
