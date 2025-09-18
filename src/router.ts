import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/root";
import { Route as HomeRoute } from "./routes/rork-home";
import { Route as MarketplaceRoute } from "./routes/marketplace";
import { Route as BuilderRoute } from "./routes/builder";
import { Route as DashboardRoute } from "./routes/dashboard";
import { Route as ProfileRoute } from "./routes/profile";

const routeTree = rootRoute.addChildren([
  HomeRoute,
  MarketplaceRoute,
  BuilderRoute,
  DashboardRoute,
  ProfileRoute,
]);

// src/components/NotFoundRedirect.tsx
import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ErrorBoundary } from "./components/ErrorBoundary";

export function NotFoundRedirect() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Navigate to the main route ('/') immediately on mount
    // 'replace: true' prevents the invalid URL from being added to browser history
    navigate({ to: "/", replace: true });
  }, [navigate]); // Dependency array ensures this runs only once

  // Optionally render null or a loading indicator while redirecting
  // The redirect is usually very fast, so null is often fine.
  return null;
  // Or: return <div>Redirecting...</div>;
}

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundRedirect,
  defaultErrorComponent: ErrorBoundary,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
