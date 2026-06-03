import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as classStorage, P as PageHeader, C as Card, a as CardContent, b as CardHeader, d as CardTitle, e as CardDescription } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription } from "./dialog-DBeLlzfZ.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CprBhaPa.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { L as Label } from "./label-BIiCNsEU.mjs";
import { g as generateId } from "./helpers-CMfmjl36.mjs";
import { P as Plus, h as SquarePen, i as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/date-fns.mjs";
function ClassesPage() {
  const [classes, setClasses] = reactExports.useState([]);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    grade: "",
    section: "",
    capacity: 30,
    description: "",
    roomNumber: ""
  });
  reactExports.useEffect(() => {
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
      const newClass = {
        id: generateId(),
        ...formData,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        teachers: []
      };
      classStorage.add(newClass);
    }
    resetForm();
    loadClasses();
  };
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this class?")) {
      classStorage.delete(id);
      loadClasses();
    }
  };
  const handleEdit = (classData) => {
    setFormData({
      name: classData.name,
      grade: classData.grade,
      section: classData.section,
      capacity: classData.capacity,
      description: classData.description,
      roomNumber: classData.roomNumber || ""
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
      roomNumber: ""
    });
    setEditingId(null);
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Manage Classes", description: "View and manage all classes in your school.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => resetForm(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Add Class"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingId ? "Edit Class" : "Add New Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editingId ? "Edit the class details" : "Create a new class" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.name, onChange: (e) => setFormData({
              ...formData,
              name: e.target.value
            }), placeholder: "e.g., 10-A" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Grade *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.grade, onChange: (e) => setFormData({
                ...formData,
                grade: e.target.value
              }), placeholder: "e.g., 10" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.section, onChange: (e) => setFormData({
                ...formData,
                section: e.target.value
              }), placeholder: "e.g., A" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Capacity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: formData.capacity, onChange: (e) => setFormData({
                ...formData,
                capacity: parseInt(e.target.value)
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Room Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.roomNumber, onChange: (e) => setFormData({
                ...formData,
                roomNumber: e.target.value
              }), placeholder: "e.g., 101" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.description, onChange: (e) => setFormData({
              ...formData,
              description: e.target.value
            }), placeholder: "Class description" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: resetForm, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, children: "Save Class" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: classes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 text-center text-muted-foreground", children: "No classes yet. Add your first class to get started." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Classes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          "Total: ",
          classes.length,
          " classes"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Grade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Section" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Capacity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Room" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: classes.map((classItem) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: classItem.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: classItem.grade }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: classItem.section || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: classItem.capacity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: classItem.roomNumber || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEdit(classItem), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(classItem.id), className: "text-red-600 hover:text-red-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] }) })
        ] }, classItem.id)) })
      ] }) }) })
    ] }) })
  ] });
}
export {
  ClassesPage as component
};
