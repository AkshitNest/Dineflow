import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/store/authContext";
import { ThemeProvider } from "next-themes";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import RestaurantSearch from "./pages/RestaurantSearch";
import RestaurantDetail from "./pages/RestaurantDetail";
import ReservationsPage from "./pages/ReservationsPage";
import BookmarkPage from "./pages/BookmarkPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected routes - Diner */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/search" element={
                <ProtectedRoute>
                  <RestaurantSearch />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/bookmarks" element={
                <ProtectedRoute>
                  <BookmarkPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/reservations" element={
                <ProtectedRoute>
                  <ReservationsPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/restaurants/:id" element={
                <ProtectedRoute>
                  <RestaurantDetail />
                </ProtectedRoute>
              } />
              <Route path="/restaurants/:id" element={
                <ProtectedRoute>
                  <RestaurantDetail />
                </ProtectedRoute>
              } />
              
              {/* Protected routes - Restaurant Owner */}
              <Route path="/owner-dashboard" element={
                <ProtectedRoute>
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
