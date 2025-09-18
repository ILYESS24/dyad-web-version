import { createFileRoute } from "@tanstack/react-router";
import { RorkUserProfile } from "@/components/rork-platform/RorkUserProfile";

export const Route = createFileRoute("/profile")({
  component: RorkUserProfile,
});
