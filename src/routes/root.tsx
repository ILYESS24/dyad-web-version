import { createRootRoute, Outlet } from "@tanstack/react-router";
import RootLayout from "../app/layout";

export const rootRoute = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});
