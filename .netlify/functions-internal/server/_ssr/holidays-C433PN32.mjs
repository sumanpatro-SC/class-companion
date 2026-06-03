import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { k as holidayStorage, P as PageHeader, C as Card, a as CardContent, b as CardHeader, d as CardTitle, e as CardDescription } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription } from "./dialog-DBeLlzfZ.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CprBhaPa.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { L as Label } from "./label-BIiCNsEU.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1dML0qAS.mjs";
import { f as formatDateString, g as generateId } from "./helpers-CMfmjl36.mjs";
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
function HolidaysPage() {
  const [holidays, setHolidays] = reactExports.useState([]);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    date: "",
    type: "national",
    description: ""
  });
  reactExports.useEffect(() => {
    loadHolidays();
  }, []);
  const loadHolidays = () => {
    const allHolidays = holidayStorage.getAll();
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
      const newHoliday = {
        id: generateId(),
        ...formData,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      holidayStorage.add(newHoliday);
    }
    resetForm();
    loadHolidays();
  };
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this holiday?")) {
      holidayStorage.delete(id);
      loadHolidays();
    }
  };
  const handleEdit = (holiday) => {
    setFormData({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      description: holiday.description || ""
    });
    setEditingId(holiday.id);
    setIsOpen(true);
  };
  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      type: "national",
      description: ""
    });
    setEditingId(null);
    setIsOpen(false);
  };
  const typeColors = {
    national: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
    school: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100",
    cultural: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100",
    other: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Holidays", description: "Manage holidays and special days.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => resetForm(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Add Holiday"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingId ? "Edit Holiday" : "Add New Holiday" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editingId ? "Edit the holiday details" : "Create a new holiday entry" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Holiday Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.name, onChange: (e) => setFormData({
              ...formData,
              name: e.target.value
            }), placeholder: "e.g., Independence Day" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: formData.date, onChange: (e) => setFormData({
              ...formData,
              date: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.type, onValueChange: (value) => setFormData({
              ...formData,
              type: value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "national", children: "National" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "school", children: "School" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cultural", children: "Cultural" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: "Other" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.description, onChange: (e) => setFormData({
              ...formData,
              description: e.target.value
            }), placeholder: "Holiday description" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: resetForm, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, children: "Save Holiday" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: holidays.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 text-center text-muted-foreground", children: "No holidays yet. Add your first holiday to get started." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Holidays" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          "Total: ",
          holidays.length,
          " holidays"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: holidays.map((holiday) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: holiday.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDateString(holiday.date) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${typeColors[holiday.type]}`, children: holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: holiday.description || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEdit(holiday), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(holiday.id), className: "text-red-600 hover:text-red-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] }) })
        ] }, holiday.id)) })
      ] }) }) })
    ] }) })
  ] });
}
export {
  HolidaysPage as component
};
