import { createFileRoute } from "@tanstack/react-router";
import { RorkAppBuilder } from "@/components/rork-platform/RorkAppBuilder";

export const Route = createFileRoute("/builder")({
  component: RorkAppBuilder,
});
