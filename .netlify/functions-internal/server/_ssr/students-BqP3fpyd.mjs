import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as studentStorage, c as classStorage, P as PageHeader, C as Card, a as CardContent, b as CardHeader, d as CardTitle, e as CardDescription } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription } from "./dialog-DBeLlzfZ.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CprBhaPa.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { L as Label } from "./label-BIiCNsEU.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1dML0qAS.mjs";
import { g as generateId } from "./helpers-CMfmjl36.mjs";
import { P as Plus, g as Search, h as SquarePen, i as Trash2 } from "../_libs/lucide-react.mjs";
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
function StudentsPage() {
  const [students, setStudents] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [formData, setFormData] = reactExports.useState({
    name: "",
    rollNumber: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    parentName: "",
    parentPhone: "",
    address: "",
    classId: ""
  });
  reactExports.useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);
  const loadStudents = () => {
    setStudents(studentStorage.getAll());
  };
  const loadClasses = () => {
    setClasses(classStorage.getAll());
  };
  const filteredStudents = students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleSave = () => {
    if (!formData.name || !formData.rollNumber || !formData.classId) {
      alert("Please fill all required fields");
      return;
    }
    if (editingId) {
      studentStorage.update(editingId, formData);
    } else {
      const newStudent = {
        id: generateId(),
        ...formData,
        joinDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        isActive: true
      };
      studentStorage.add(newStudent);
    }
    resetForm();
    loadStudents();
  };
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      studentStorage.delete(id);
      loadStudents();
    }
  };
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      address: student.address,
      classId: student.classId
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
      classId: ""
    });
    setEditingId(null);
    setIsOpen(false);
  };
  const getClassName = (classId) => {
    return classes.find((c) => c.id === classId)?.name || "Unknown";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Manage Students", description: "View and manage all students.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => resetForm(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Add Student"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingId ? "Edit Student" : "Add New Student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editingId ? "Edit the student details" : "Create a new student record" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.name, onChange: (e) => setFormData({
                ...formData,
                name: e.target.value
              }), placeholder: "Student name" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Roll Number *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.rollNumber, onChange: (e) => setFormData({
                ...formData,
                rollNumber: e.target.value
              }), placeholder: "e.g., A01" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.classId, onValueChange: (value) => setFormData({
              ...formData,
              classId: value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a class" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: classes.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cls.id, children: cls.name }, cls.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: formData.email, onChange: (e) => setFormData({
                ...formData,
                email: e.target.value
              }), placeholder: "student@example.com" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.phone, onChange: (e) => setFormData({
                ...formData,
                phone: e.target.value
              }), placeholder: "+1234567890" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date of Birth" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: formData.dateOfBirth, onChange: (e) => setFormData({
              ...formData,
              dateOfBirth: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-3", children: "Parent Information" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Parent Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.parentName, onChange: (e) => setFormData({
                  ...formData,
                  parentName: e.target.value
                }), placeholder: "Parent/Guardian name" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Parent Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.parentPhone, onChange: (e) => setFormData({
                  ...formData,
                  parentPhone: e.target.value
                }), placeholder: "Parent phone" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.address, onChange: (e) => setFormData({
              ...formData,
              address: e.target.value
            }), placeholder: "Student address" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: resetForm, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, children: "Save Student" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name, roll number, or email...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })
      ] }) }),
      filteredStudents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 text-center text-muted-foreground", children: students.length === 0 ? "No students yet. Add your first student to get started." : "No students match your search." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Students" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            "Total: ",
            filteredStudents.length,
            " students"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Roll #" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Parent Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredStudents.map((student) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: student.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: student.rollNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getClassName(student.classId) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: student.email || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: student.parentPhone || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEdit(student), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(student.id), className: "text-red-600 hover:text-red-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
            ] }) })
          ] }, student.id)) })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  StudentsPage as component
};
