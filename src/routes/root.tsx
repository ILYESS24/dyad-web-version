import { createRootRoute, Outlet } from "@tanstack/react-router";
import { RootLayout } from "@/app";

export const rootRoute = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});
