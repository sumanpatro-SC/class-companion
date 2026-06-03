import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { m as announcementStorage, c as classStorage, P as PageHeader, C as Card, a as CardContent, b as CardHeader, d as CardTitle, e as CardDescription } from "./storage-BZHb4tET.mjs";
import { B as Button } from "./button-C2QL49EP.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription } from "./dialog-DBeLlzfZ.mjs";
import { I as Input } from "./input-hWy07v4T.mjs";
import { L as Label } from "./label-BIiCNsEU.mjs";
import { c as cn } from "./router-DsChniCp.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-1dML0qAS.mjs";
import { g as generateId } from "./helpers-CMfmjl36.mjs";
import { P as Plus, i as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
import "../_libs/isbot.mjs";
import "../_libs/tailwind-merge.mjs";
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
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
function AnnouncementsPage() {
  const [announcements, setAnnouncements] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    title: "",
    content: "",
    type: "info",
    classId: ""
  });
  reactExports.useEffect(() => {
    loadAnnouncements();
    loadClasses();
  }, []);
  const loadAnnouncements = () => {
    const allAnnouncements = announcementStorage.getAll();
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
    const newAnnouncement = {
      id: generateId(),
      ...formData,
      createdBy: "Admin",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    announcementStorage.add(newAnnouncement);
    resetForm();
    loadAnnouncements();
  };
  const handleDelete = (id) => {
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
      classId: ""
    });
    setIsOpen(false);
  };
  const typeColors = {
    general: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
    urgent: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
    info: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
  };
  const typeIcons = {
    general: "📢",
    urgent: "🚨",
    info: "ℹ️"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Announcements", description: "Create and manage announcements for classes.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => resetForm(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "New Announcement"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create New Announcement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Create an announcement to notify teachers and students" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.title, onChange: (e) => setFormData({
              ...formData,
              title: e.target.value
            }), placeholder: "Announcement title" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.type, onValueChange: (value) => setFormData({
              ...formData,
              type: value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "general", children: "General" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "urgent", children: "Urgent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "info", children: "Information" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.classId, onValueChange: (value) => setFormData({
              ...formData,
              classId: value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "For all classes" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", children: "All Classes" }),
                classes.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cls.id, children: cls.name }, cls.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Content *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: formData.content, onChange: (e) => setFormData({
              ...formData,
              content: e.target.value
            }), placeholder: "Announcement content", rows: 5 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: resetForm, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, children: "Post Announcement" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: announcements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 text-center text-muted-foreground", children: "No announcements yet. Create one to get started." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: announcements.map((announcement) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: announcement.type === "urgent" ? "border-red-300" : "", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: typeIcons[announcement.type] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: announcement.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${typeColors[announcement.type]}`, children: announcement.type.toUpperCase() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "mt-1", children: [
            announcement.classId ? `For: ${classes.find((c) => c.id === announcement.classId)?.name || "Class"}` : "For: All Classes",
            " ",
            "• ",
            new Date(announcement.createdAt).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(announcement.id), className: "text-red-600 hover:text-red-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-sm", children: announcement.content }) })
    ] }, announcement.id)) }) })
  ] });
}
export {
  AnnouncementsPage as component
};
