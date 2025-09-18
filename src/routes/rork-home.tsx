import { createFileRoute } from "@tanstack/react-router";
import RorkHomePage from "@/pages/rork-home";

export const Route = createFileRoute("/")({
  component: RorkHomePage,
});
