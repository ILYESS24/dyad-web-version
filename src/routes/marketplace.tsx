import { createFileRoute } from "@tanstack/react-router";
import { RorkMarketplace } from "@/components/rork-platform/RorkMarketplace";

export const Route = createFileRoute("/marketplace")({
  component: RorkMarketplace,
});
