import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import { AuthLayout } from '../layouts/AuthLayout';
import { VendorRegisterPage } from '../features/auth/pages/VendorRegisterPage';
import { VendorLoginPage } from '../features/auth/pages/VendorLoginPage';
import { VendorVerifyOtpPage } from '../features/auth/pages/VendorVerifyOtpPage';
import { VendorForgotPasswordPage } from '../features/auth/pages/VendorForgotPasswordPage';
import { VendorOnboardingPlaceholder } from '../features/auth/pages/VendorOnboardingPlaceholder';
import { VendorStatusPlaceholder } from '../features/auth/pages/VendorStatusPlaceholder';
import { VendorLayout } from '../layouts/VendorLayout';
import { RequireApprovedVendor } from './RequireApprovedVendor';
import { VendorDashboardPage } from '../features/dashboard/pages/VendorDashboardPage';
import { VendorPlaceholderPage } from '../features/dashboard/pages/VendorPlaceholderPage';
import { VendorProductsPage } from '../features/products/pages/VendorProductsPage';
import { VendorProductFormPage } from '../features/products/pages/VendorProductFormPage';
import { TermsPage } from '../pages/TermsPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { AdminLoginPage } from '../features/admin/pages/AdminLoginPage';
import { AdminLayout } from '../layouts/AdminLayout';
import { RequireAdmin } from './RequireAdmin';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminProductReviewsPage } from '../features/admin/pages/AdminProductReviewsPage';
import { AdminProductReviewDetailPage } from '../features/admin/pages/AdminProductReviewDetailPage';
import { AdminCategoriesPage } from '../features/admin/pages/AdminCategoriesPage';
import { AdminPlaceholderPage } from '../features/admin/pages/AdminPlaceholderPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Existing Buyer Landing Page route */}
      <Route path="/" element={<App />} />

      {/* Vendor Authentication & Onboarding Routes */}
      <Route
        path="/vendor/register"
        element={
          <AuthLayout>
            <VendorRegisterPage />
          </AuthLayout>
        }
      />
      <Route
        path="/vendor/login"
        element={
          <AuthLayout>
            <VendorLoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/vendor/verify-otp"
        element={
          <AuthLayout>
            <VendorVerifyOtpPage />
          </AuthLayout>
        }
      />
      <Route
        path="/vendor/forgot-password"
        element={
          <AuthLayout>
            <VendorForgotPasswordPage />
          </AuthLayout>
        }
      />

      {/* Approved Vendor Portal Protected Routes */}
      <Route
        element={
          <RequireApprovedVendor>
            <VendorLayout />
          </RequireApprovedVendor>
        }
      >
        <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
        <Route path="/vendor/products" element={<VendorProductsPage />} />
        <Route path="/vendor/products/new" element={<VendorProductFormPage />} />
        <Route path="/vendor/products/:id/edit" element={<VendorProductFormPage />} />
        <Route path="/vendor/services" element={<VendorPlaceholderPage />} />
        <Route path="/vendor/orders" element={<VendorPlaceholderPage />} />
        <Route path="/vendor/earnings" element={<VendorPlaceholderPage />} />
        <Route path="/vendor/reviews" element={<VendorPlaceholderPage />} />
        <Route path="/vendor/profile" element={<VendorPlaceholderPage />} />
        <Route path="/vendor/settings" element={<VendorPlaceholderPage />} />
        <Route path="/vendor/support" element={<VendorPlaceholderPage />} />
      </Route>
      <Route
        path="/vendor/onboarding"
        element={
          <AuthLayout>
            <VendorOnboardingPlaceholder />
          </AuthLayout>
        }
      />
      <Route
        path="/vendor/status"
        element={
          <AuthLayout>
            <VendorStatusPlaceholder />
          </AuthLayout>
        }
      />

      {/* Super Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/product-reviews" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/product-reviews" element={<AdminProductReviewsPage />} />
        <Route path="/admin/product-reviews/:id" element={<AdminProductReviewDetailPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/seller-approvals" element={<AdminPlaceholderPage />} />
      </Route>

      {/* Legal & Policy Pages */}
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
