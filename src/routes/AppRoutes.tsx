import type { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/shop/ShopPage';
import { ProductDetailsPage } from '../pages/shop/ProductDetailsPage';
import { BrandsPage } from '../pages/brands/BrandsPage';
import { CategoryPage } from '../pages/category/CategoryPage';
import { AboutPage } from '../pages/about/AboutPage';
import { ContactPage } from '../pages/contact/ContactPage';
import { CartPage } from '../pages/cart/CartPage';
import { WishlistPage } from '../pages/wishlist/WishlistPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { GiftVouchersPage } from '../pages/vouchers/GiftVouchersPage';
import { MyVouchersPage } from '../pages/vouchers/MyVouchersPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
import { InventoryDashboardPage } from '../pages/dashboard/InventoryDashboardPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { UserRole } from '../types';

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Public Storefront Routes */}
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:slug" element={<ProductDetailsPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="gift-vouchers" element={<GiftVouchersPage />} />
        <Route
          path="my-vouchers"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER, UserRole.ADMIN, UserRole.INVENTORY_MANAGER]}>
              <MyVouchersPage />
            </ProtectedRoute>
          }
        />

        {/* Authentication Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        {/* Role-Protected Admin Dashboard */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/dashboard"
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
        <Route
          path="inventory/dashboard"
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
