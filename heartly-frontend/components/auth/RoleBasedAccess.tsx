"use client";
import React from "react";
import { useUser } from "@/shared/context/UserContext";

export type UserRole = "OWNER" | "ADMIN" | "STAFF";
export type CustomUserRole = string; // Custom roles are strings with tenant prefixes

interface RoleBasedAccessProps {
  allowedRoles: (UserRole | CustomUserRole)[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAllRoles?: boolean; // If true, user must have ALL roles, not just one
}

/**
 * Component that conditionally renders children based on user role(s)
 * @param allowedRoles - Array of roles that are allowed to see the content
 * @param children - Content to render if user has allowed role
 * @param fallback - Optional content to render if user doesn't have allowed role
 * @param requireAllRoles - If true, user must have ALL roles, not just one
 */
export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback = null,
  requireAllRoles = false,
}) => {
  const { getUserRole, isLoading } = useUser();
  
  // Don't render anything while loading user data
  if (isLoading) {
    return null;
  }
  
  const userRole = getUserRole() as UserRole | CustomUserRole | undefined;
  
  // For now, we only support checking the primary role
  // TODO: In the future, this could be enhanced to check multiple user roles
  // when users can have multiple roles assigned
  const hasAccess = userRole && allowedRoles.includes(userRole);
  
  return <>{hasAccess ? children : fallback}</>;
};

/**
 * Hook to check if user has specific role(s)
 * @param allowedRoles - Role or array of roles to check
 * @returns boolean indicating if user has any of the allowed roles
 */
export const useHasRole = (allowedRoles: (UserRole | CustomUserRole) | (UserRole | CustomUserRole)[]): boolean => {
  const { getUserRole } = useUser();
  const userRole = getUserRole() as UserRole | CustomUserRole | undefined;
  
  if (!userRole) return false;
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(userRole);
};

/**
 * Hook to check if user has specific permission
 * This would require backend API integration to check user's actual permissions
 * @param permission - Permission to check (e.g., 'users:write', 'clients:read')
 * @returns boolean indicating if user has the permission
 */
export const useHasCustomPermission = (permission: string): boolean => {
  // TODO: Implement API call to check user's permissions
  // For now, return false as this requires backend integration
  console.warn('useHasCustomPermission not fully implemented - requires backend API integration');
  return false;
};

/**
 * Hook to check if user has specific permission based on role hierarchy
 * OWNER has all permissions
 * ADMIN has admin and staff permissions
 * STAFF has only staff permissions
 */
export const useHasPermission = (minRole: UserRole): boolean => {
  const { getUserRole } = useUser();
  const userRole = getUserRole() as UserRole | undefined;
  
  if (!userRole) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    OWNER: 3,
    ADMIN: 2,
    STAFF: 1,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[minRole];
};

// Convenience components for common role checks
export const OwnerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={["OWNER"]} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={["ADMIN"]} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const AdminOrOwner: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={["OWNER", "ADMIN"]} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const StaffOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={["STAFF"]} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);