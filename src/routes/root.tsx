import { createRootRoute, Outlet } from "@tanstack/react-router";
import AppLayout from "./AppLayout";

export const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
