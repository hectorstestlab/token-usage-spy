import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/UserContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import NotFound from "./pages/NotFound";

// Planner pages
import PlannerDashboard from "./components/planner/PlannerDashboard";
import PlannerWeddings from "./components/planner/PlannerWeddings";
import PlannerClients from "./components/planner/PlannerClients";
import PlannerVendors from "./components/planner/PlannerVendors";
import PlannerBudget from "./components/planner/PlannerBudget";
import PlannerMarketplace from "./components/planner/PlannerMarketplace";

// Client pages
import ClientDashboard from "./components/client/ClientDashboard";
import ClientWedding from "./components/client/ClientWedding";
import ClientVendors from "./components/client/ClientVendors";
import ClientBudget from "./components/client/ClientBudget";
import ClientMarketplace from "./components/client/ClientMarketplace";

// Vendor pages
import VendorDashboard from "./components/vendor/VendorDashboard";
import VendorBookings from "./components/vendor/VendorBookings";
import VendorServices from "./components/vendor/VendorServices";
import VendorReviews from "./components/vendor/VendorReviews";
import VendorMarketplace from "./components/vendor/VendorMarketplace";

// Shared pages
import Messages from "./components/shared/Messages";
import SettingsPage from "./components/shared/SettingsPage";
import PaymentSettings from "./components/shared/PaymentSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Planner routes */}
            <Route path="/planner" element={<DashboardLayout />}>
              <Route path="dashboard" element={<PlannerDashboard />} />
              <Route path="weddings" element={<PlannerWeddings />} />
              <Route path="clients" element={<PlannerClients />} />
              <Route path="vendors" element={<PlannerVendors />} />
              <Route path="marketplace" element={<PlannerMarketplace />} />
              <Route path="budget" element={<PlannerBudget />} />
              <Route path="messages" element={<Messages />} />
              <Route path="payments" element={<PaymentSettings />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Client routes */}
            <Route path="/client" element={<DashboardLayout />}>
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="wedding" element={<ClientWedding />} />
              <Route path="vendors" element={<ClientVendors />} />
              <Route path="marketplace" element={<ClientMarketplace />} />
              <Route path="budget" element={<ClientBudget />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Vendor routes */}
            <Route path="/vendor" element={<DashboardLayout />}>
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route path="bookings" element={<VendorBookings />} />
              <Route path="services" element={<VendorServices />} />
              <Route path="reviews" element={<VendorReviews />} />
              <Route path="marketplace" element={<VendorMarketplace />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
