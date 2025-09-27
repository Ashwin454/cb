// GlobalRouteProtection.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { RouteProtection } from "./RouteProtection";

export function GlobalRouteProtection({ children }) {
  const location = useLocation();
  const pathname = location.pathname;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/campus/register",
    "/auth/callback",
    "/forgot-password",
    "/verify-email",
  ];

  // Check if current route is an admin route
  const isAdminRoute = pathname.startsWith("/admin");

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // For public or admin routes, don't apply global protection
  // Admin routes have their own protection in admin layout
  if (isPublicRoute || isAdminRoute) {
    return <RouteProtection requireAuth={false}>{children}</RouteProtection>;
  }

  // For other protected routes, require authentication with role-based access
  return <RouteProtection requireAuth={true}>{children}</RouteProtection>;
}
