import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/UserContext";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { EntitiesProvider } from "@/contexts/EntitiesContext";
import { InterviewsProvider } from "@/contexts/InterviewsContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Planner pages
import PlannerDashboard from "./components/planner/PlannerDashboard";
import PlannerAnalytics from "./components/planner/PlannerAnalytics";
import PlannerWeddings from "./components/planner/PlannerWeddings";
import PlannerClients from "./components/planner/PlannerClients";

import PlannerBudget from "./components/planner/PlannerBudget";
import PlannerMarketplace from "./components/planner/PlannerMarketplace";
import PlannerInterviews from "./components/planner/PlannerInterviews";

// Client pages
import ClientDashboard from "./components/client/ClientDashboard";
import ClientWedding from "./components/client/ClientWedding";

import ClientBudget from "./components/client/ClientBudget";
import ClientMarketplace from "./components/client/ClientMarketplace";
import ClientPaymentApprovals from "./components/client/ClientPaymentApprovals";

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
      <MarketplaceProvider>
      <EntitiesProvider>
      <InterviewsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Planner routes */}
            <Route path="/planner" element={<ProtectedRoute allowedRole="planner"><DashboardLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<PlannerDashboard />} />
              <Route path="analytics" element={<PlannerAnalytics />} />
              <Route path="weddings" element={<PlannerWeddings />} />
              <Route path="clients" element={<PlannerClients />} />
              <Route path="interviews" element={<PlannerInterviews />} />
              
              <Route path="marketplace" element={<PlannerMarketplace />} />
              <Route path="budget" element={<PlannerBudget />} />
              <Route path="messages" element={<Messages />} />
              <Route path="payments" element={<PaymentSettings />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Client routes */}
            <Route path="/client" element={<ProtectedRoute allowedRole="client"><DashboardLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="wedding" element={<ClientWedding />} />
              
              <Route path="marketplace" element={<ClientMarketplace />} />
              <Route path="budget" element={<ClientBudget />} />
              <Route path="messages" element={<Messages />} />
              <Route path="approvals" element={<ClientPaymentApprovals />} />
              <Route path="payments" element={<PaymentSettings />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Vendor routes */}
            <Route path="/vendor" element={<ProtectedRoute allowedRole="vendor"><DashboardLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route path="bookings" element={<VendorBookings />} />
              <Route path="services" element={<VendorServices />} />
              <Route path="reviews" element={<VendorReviews />} />
              <Route path="marketplace" element={<VendorMarketplace />} />
              <Route path="messages" element={<Messages />} />
              <Route path="payments" element={<PaymentSettings />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>


            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </InterviewsProvider>
      </EntitiesProvider>
      </MarketplaceProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
