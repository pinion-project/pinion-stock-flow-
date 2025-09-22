import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole, Permission } from "@/types/auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import PurchaseSuggestions from "./pages/PurchaseSuggestions";
import InventoryReports from "./pages/InventoryReports";
import Warehouses from "./pages/Warehouses";
import WarehouseDetails from "./pages/WarehouseDetails";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import AuditLogs from "./pages/AuditLogs";
import BackupRestore from "./pages/BackupRestore";
import DataManagement from "./pages/DataManagement";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RealtimeProvider>
          <AlertProvider>
            <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* الصفحات العامة */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* الصفحات المحمية */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/products" element={
                <ProtectedRoute requiredPermission={Permission.MANAGE_PRODUCTS}>
                  <Products />
                </ProtectedRoute>
              } />
              
              <Route path="/purchase-suggestions" element={
                <ProtectedRoute requiredPermission={Permission.VIEW_PURCHASE_SUGGESTIONS}>
                  <PurchaseSuggestions />
                </ProtectedRoute>
              } />
              
              <Route path="/inventory-reports" element={
                <ProtectedRoute requiredPermission={Permission.VIEW_PURCHASE_REPORTS}>
                  <InventoryReports />
                </ProtectedRoute>
              } />
              
              <Route path="/warehouses" element={
                <ProtectedRoute requiredPermission={Permission.VIEW_ALL_WAREHOUSES}>
                  <Warehouses />
                </ProtectedRoute>
              } />
              
              <Route path="/warehouse/:id" element={
                <ProtectedRoute requiredPermission={Permission.VIEW_ALL_WAREHOUSES}>
                  <WarehouseDetails />
                </ProtectedRoute>
              } />
              
              <Route path="/inventory" element={
                <ProtectedRoute requiredPermission={Permission.MANAGE_INVENTORY}>
                  <Inventory />
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute requiredPermission={Permission.VIEW_SYSTEM_REPORTS}>
                  <Analytics />
                </ProtectedRoute>
              } />
              
              <Route path="/users" element={
                <ProtectedRoute requiredRole={UserRole.GENERAL_MANAGER} requiredPermission={Permission.MANAGE_USERS}>
                  <Users />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/audit-logs" element={
                <ProtectedRoute requiredRole={UserRole.GENERAL_MANAGER} requiredPermission={Permission.VIEW_AUDIT_LOGS}>
                  <AuditLogs />
                </ProtectedRoute>
              } />
              
              <Route path="/backup-restore" element={
                <ProtectedRoute requiredRole={UserRole.GENERAL_MANAGER} requiredPermission={Permission.MANAGE_BACKUP_RESTORE}>
                  <BackupRestore />
                </ProtectedRoute>
              } />
              
              <Route path="/data-management" element={
                <ProtectedRoute requiredRole={UserRole.GENERAL_MANAGER}>
                  <DataManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute requiredPermission={Permission.MANAGE_SYSTEM_SETTINGS}>
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
            </NotificationProvider>
          </AlertProvider>
        </RealtimeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
