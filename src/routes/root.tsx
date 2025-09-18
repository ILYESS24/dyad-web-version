import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RorkNavigation } from "@/components/rork-platform/RorkNavigation";

const queryClient = new QueryClient();

export const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50">
          <RorkNavigation currentUser={{
            name: 'Alex Developer',
            avatar: '/api/placeholder/32/32',
            notifications: 3
          }} />
          <main>
            <Outlet />
          </main>
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
