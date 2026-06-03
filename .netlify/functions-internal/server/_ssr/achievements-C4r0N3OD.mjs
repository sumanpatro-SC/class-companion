import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as classStorage, s as studentStorage, j as achievementStorage, P as PageHeader, C as Card, b as CardHeader, d as CardTitle, a as CardContent, e as CardDescription } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription } from "./dialog-DBeLlzfZ.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CprBhaPa.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { L as Label } from "./label-BIiCNsEU.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1dML0qAS.mjs";
import { g as generateId } from "./helpers-CMfmjl36.mjs";
import { P as Plus, i as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/date-fns.mjs";
function AchievementsPage() {
  const [achievements, setAchievements] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const [students, setStudents] = reactExports.useState([]);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [selectedClass, setSelectedClass] = reactExports.useState("");
  const [formData, setFormData] = reactExports.useState({
    studentId: "",
    title: "",
    description: "",
    category: "academic",
    points: 10
  });
  reactExports.useEffect(() => {
    loadClasses();
    loadAchievements();
  }, []);
  reactExports.useEffect(() => {
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
    const newAchievement = {
      id: generateId(),
      ...formData,
      classId: student.classId,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    achievementStorage.add(newAchievement);
    resetForm();
    loadAchievements();
  };
  const handleDelete = (id) => {
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
      points: 10
    });
    setSelectedClass("");
    setIsOpen(false);
  };
  const getStudentName = (studentId) => {
    return studentStorage.getById(studentId)?.name || "Unknown";
  };
  const categoryColors = {
    academic: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
    sports: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100",
    cultural: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100",
    behavioral: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
    other: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
  };
  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Achievements", description: "Manage student achievements and awards.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => resetForm(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Add Achievement"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add New Achievement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Record a student achievement or award" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Select Class *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedClass, onValueChange: setSelectedClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a class" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: classes.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cls.id, children: cls.name }, cls.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Student *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.studentId, onValueChange: (value) => setFormData({
              ...formData,
              studentId: value
            }), disabled: !selectedClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a student" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: students.map((student) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: student.id, children: student.name }, student.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.title, onChange: (e) => setFormData({
              ...formData,
              title: e.target.value
            }), placeholder: "e.g., Science Olympiad Winner" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.description, onChange: (e) => setFormData({
              ...formData,
              description: e.target.value
            }), placeholder: "Achievement details" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.category, onValueChange: (value) => setFormData({
                ...formData,
                category: value
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "academic", children: "Academic" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "sports", children: "Sports" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cultural", children: "Cultural" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "behavioral", children: "Behavioral" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: "Other" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Points" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: formData.points, onChange: (e) => setFormData({
                ...formData,
                points: parseInt(e.target.value)
              }), min: "1" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: resetForm, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, children: "Save Achievement" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Total Achievements" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: achievements.length }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Total Points Awarded" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-yellow-600", children: totalPoints }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Students Rewarded" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: new Set(achievements.map((a) => a.studentId)).size }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Achievements List" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "All recorded achievements" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: achievements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-muted-foreground py-8", children: "No achievements recorded yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Student" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Points" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: achievements.map((achievement) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: getStudentName(achievement.studentId) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: achievement.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${categoryColors[achievement.category]}`, children: achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-yellow-600", children: [
              "+",
              achievement.points
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: achievement.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(achievement.id), className: "text-red-600 hover:text-red-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) })
          ] }, achievement.id)) })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  AchievementsPage as component
};
