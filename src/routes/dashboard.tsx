import { createFileRoute } from "@tanstack/react-router";
import { RorkDashboard } from "@/components/rork-platform/RorkDashboard";

export const Route = createFileRoute("/dashboard")({
  component: RorkDashboard,
});
