import type { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
import { InventoryDashboardPage } from '../pages/dashboard/InventoryDashboardPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { UserRole } from '../types';

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Role-Protected Admin Dashboard */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Role-Protected Inventory Management Dashboard */}
        <Route
          path="inventory"
          element={
            <ProtectedRoute allowedRoles={[UserRole.INVENTORY_MANAGER, UserRole.ADMIN]}>
              <InventoryDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
