import { createRootRoute, Outlet } from "@tanstack/react-router";
import RootLayout from "@/app/layout.tsx";

export const rootRoute = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});
