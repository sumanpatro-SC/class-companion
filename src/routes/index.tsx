import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.navigate({ to: "/dashboard" });
  }, [router]);

  return null;
}