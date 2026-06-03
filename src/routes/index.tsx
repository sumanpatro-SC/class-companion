import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Class Companion" },
      { name: "description", content: "Welcome to Class Companion" },
      { property: "og:title", content: "Class Companion" },
      { property: "og:description", content: "Welcome to Class Companion" },
    ],
  }),
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-foreground">Welcome</h1>
        <p className="mt-4 text-muted-foreground">Class Companion is ready to use.</p>
      </div>
    </div>
  ),
});