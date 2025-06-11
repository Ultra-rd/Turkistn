
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "@/hooks/use-theme";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminTours from "./pages/AdminTours";
import AdminNewTour from "./pages/AdminNewTour";
import AdminBookings from "./pages/AdminBookings";
import AdminDestinations from "./pages/AdminDestinations";
import AdminEvents from "./pages/AdminEvents";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAttractions from "./pages/AdminAttractions";
import AdminTourAgents from "./pages/AdminTourAgents";
import AdminUsers from "./pages/AdminUsers";
import DestinationDetails from "./pages/DestinationDetails";
import AdminEditDestination from "./pages/AdminEditDestination";
import TourAgentDetails from "./pages/TourAgentDetails";

const App = () => {
  // Create a client
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/tours" element={<AdminTours />} />
                <Route path="/admin/tours/new" element={<AdminNewTour />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/destinations" element={<AdminDestinations />} />
                <Route path="/admin/destinations/edit/:id" element={<AdminEditDestination />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/attractions" element={<AdminAttractions />} />
                <Route path="/admin/tour-agents" element={<AdminTourAgents />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/destination/:id" element={<DestinationDetails />} />
                <Route path="/tour-agent/:id" element={<TourAgentDetails />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
