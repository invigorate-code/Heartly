import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  RoleBasedAccess,
  OwnerOnly,
  AdminOnly,
  AdminOrOwner,
  StaffOnly,
  useHasRole,
  useHasPermission,
} from '../RoleBasedAccess';
import { useUser } from '@/shared/context/UserContext';

// Mock the UserContext
jest.mock('@/shared/context/UserContext', () => ({
  useUser: jest.fn(),
}));

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe('RoleBasedAccess Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RoleBasedAccess', () => {
    it('should render children when user has allowed role', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue('OWNER'),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      render(
        <RoleBasedAccess allowedRoles={['OWNER', 'ADMIN']}>
          <div>Protected Content</div>
        </RoleBasedAccess>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should not render children when user lacks allowed role', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue('STAFF'),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      render(
        <RoleBasedAccess allowedRoles={['OWNER', 'ADMIN']}>
          <div>Protected Content</div>
        </RoleBasedAccess>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render fallback when user lacks allowed role', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue('STAFF'),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      render(
        <RoleBasedAccess
          allowedRoles={['OWNER']}
          fallback={<div>Access Denied</div>}
        >
          <div>Protected Content</div>
        </RoleBasedAccess>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should not render anything while loading', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue('OWNER'),
        isLoading: true,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      const { container } = render(
        <RoleBasedAccess allowedRoles={['OWNER']}>
          <div>Protected Content</div>
        </RoleBasedAccess>
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle undefined user role', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue(undefined),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      render(
        <RoleBasedAccess allowedRoles={['OWNER']}>
          <div>Protected Content</div>
        </RoleBasedAccess>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Convenience Components', () => {
    describe('OwnerOnly', () => {
      it('should render content for OWNER role', () => {
        mockUseUser.mockReturnValue({
          getUserRole: jest.fn().mockReturnValue('OWNER'),
          isLoading: false,
          user: null,
          userDisplayName: jest.fn(),
          isOnboardingRequired: jest.fn(),
          isOnboardingCompleted: jest.fn(),
          isOwner: jest.fn(),
          getUserId: jest.fn(),
          getTenantId: jest.fn(),
          getUserEmail: jest.fn(),
        });

        render(
          <OwnerOnly>
            <div>Owner Content</div>
          </OwnerOnly>
        );

        expect(screen.getByText('Owner Content')).toBeInTheDocument();
      });

      it('should not render content for non-OWNER role', () => {
        mockUseUser.mockReturnValue({
          getUserRole: jest.fn().mockReturnValue('ADMIN'),
          isLoading: false,
          user: null,
          userDisplayName: jest.fn(),
          isOnboardingRequired: jest.fn(),
          isOnboardingCompleted: jest.fn(),
          isOwner: jest.fn(),
          getUserId: jest.fn(),
          getTenantId: jest.fn(),
          getUserEmail: jest.fn(),
        });

        render(
          <OwnerOnly>
            <div>Owner Content</div>
          </OwnerOnly>
        );

        expect(screen.queryByText('Owner Content')).not.toBeInTheDocument();
      });
    });

    describe('AdminOnly', () => {
      it('should render content for ADMIN role', () => {
        mockUseUser.mockReturnValue({
          getUserRole: jest.fn().mockReturnValue('ADMIN'),
          isLoading: false,
          user: null,
          userDisplayName: jest.fn(),
          isOnboardingRequired: jest.fn(),
          isOnboardingCompleted: jest.fn(),
          isOwner: jest.fn(),
          getUserId: jest.fn(),
          getTenantId: jest.fn(),
          getUserEmail: jest.fn(),
        });

        render(
          <AdminOnly>
            <div>Admin Content</div>
          </AdminOnly>
        );

        expect(screen.getByText('Admin Content')).toBeInTheDocument();
      });
    });

    describe('AdminOrOwner', () => {
      it('should render content for OWNER role', () => {
        mockUseUser.mockReturnValue({
          getUserRole: jest.fn().mockReturnValue('OWNER'),
          isLoading: false,
          user: null,
          userDisplayName: jest.fn(),
          isOnboardingRequired: jest.fn(),
          isOnboardingCompleted: jest.fn(),
          isOwner: jest.fn(),
          getUserId: jest.fn(),
          getTenantId: jest.fn(),
          getUserEmail: jest.fn(),
        });

        render(
          <AdminOrOwner>
            <div>Admin or Owner Content</div>
          </AdminOrOwner>
        );

        expect(screen.getByText('Admin or Owner Content')).toBeInTheDocument();
      });

      it('should render content for ADMIN role', () => {
        mockUseUser.mockReturnValue({
          getUserRole: jest.fn().mockReturnValue('ADMIN'),
          isLoading: false,
          user: null,
          userDisplayName: jest.fn(),
          isOnboardingRequired: jest.fn(),
          isOnboardingCompleted: jest.fn(),
          isOwner: jest.fn(),
          getUserId: jest.fn(),
          getTenantId: jest.fn(),
          getUserEmail: jest.fn(),
        });

        render(
          <AdminOrOwner>
            <div>Admin or Owner Content</div>
          </AdminOrOwner>
        );

        expect(screen.getByText('Admin or Owner Content')).toBeInTheDocument();
      });

      it('should not render content for STAFF role', () => {
        mockUseUser.mockReturnValue({
          getUserRole: jest.fn().mockReturnValue('STAFF'),
          isLoading: false,
          user: null,
          userDisplayName: jest.fn(),
          isOnboardingRequired: jest.fn(),
          isOnboardingCompleted: jest.fn(),
          isOwner: jest.fn(),
          getUserId: jest.fn(),
          getTenantId: jest.fn(),
          getUserEmail: jest.fn(),
        });

        render(
          <AdminOrOwner>
            <div>Admin or Owner Content</div>
          </AdminOrOwner>
        );

        expect(screen.queryByText('Admin or Owner Content')).not.toBeInTheDocument();
      });
    });

    describe('StaffOnly', () => {
      it('should render content for STAFF role', () => {
        mockUseUser.mockReturnValue({
          getUserRole: jest.fn().mockReturnValue('STAFF'),
          isLoading: false,
          user: null,
          userDisplayName: jest.fn(),
          isOnboardingRequired: jest.fn(),
          isOnboardingCompleted: jest.fn(),
          isOwner: jest.fn(),
          getUserId: jest.fn(),
          getTenantId: jest.fn(),
          getUserEmail: jest.fn(),
        });

        render(
          <StaffOnly>
            <div>Staff Content</div>
          </StaffOnly>
        );

        expect(screen.getByText('Staff Content')).toBeInTheDocument();
      });
    });
  });

  describe('useHasRole Hook', () => {
    it('should return true when user has the specified role', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue('ADMIN'),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      const { result } = renderHook(() => useHasRole('ADMIN'));

      expect(result.current).toBe(true);
    });

    it('should return false when user lacks the specified role', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue('STAFF'),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      const { result } = renderHook(() => useHasRole('ADMIN'));

      expect(result.current).toBe(false);
    });

    it('should handle array of roles', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue('ADMIN'),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      const { result } = renderHook(() => useHasRole(['OWNER', 'ADMIN']));

      expect(result.current).toBe(true);
    });

    it('should return false when user role is undefined', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue(undefined),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      const { result } = renderHook(() => useHasRole('ADMIN'));

      expect(result.current).toBe(false);
    });
  });

  describe('useHasPermission Hook', () => {
    it('should return true for OWNER with any minimum role', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue('OWNER'),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      const { result: ownerCanAdmin } = renderHook(() => useHasPermission('ADMIN'));
      const { result: ownerCanStaff } = renderHook(() => useHasPermission('STAFF'));

      expect(ownerCanAdmin.current).toBe(true);
      expect(ownerCanStaff.current).toBe(true);
    });

    it('should return correct permissions for ADMIN', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue('ADMIN'),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      const { result: adminCanOwner } = renderHook(() => useHasPermission('OWNER'));
      const { result: adminCanAdmin } = renderHook(() => useHasPermission('ADMIN'));
      const { result: adminCanStaff } = renderHook(() => useHasPermission('STAFF'));

      expect(adminCanOwner.current).toBe(false);
      expect(adminCanAdmin.current).toBe(true);
      expect(adminCanStaff.current).toBe(true);
    });

    it('should return correct permissions for STAFF', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue('STAFF'),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      const { result: staffCanOwner } = renderHook(() => useHasPermission('OWNER'));
      const { result: staffCanAdmin } = renderHook(() => useHasPermission('ADMIN'));
      const { result: staffCanStaff } = renderHook(() => useHasPermission('STAFF'));

      expect(staffCanOwner.current).toBe(false);
      expect(staffCanAdmin.current).toBe(false);
      expect(staffCanStaff.current).toBe(true);
    });

    it('should return false when user role is undefined', () => {
      mockUseUser.mockReturnValue({
        getUserRole: jest.fn().mockReturnValue(undefined),
        isLoading: false,
        user: null,
        userDisplayName: jest.fn(),
        isOnboardingRequired: jest.fn(),
        isOnboardingCompleted: jest.fn(),
        isOwner: jest.fn(),
        getUserId: jest.fn(),
        getTenantId: jest.fn(),
        getUserEmail: jest.fn(),
      });

      const { result } = renderHook(() => useHasPermission('STAFF'));

      expect(result.current).toBe(false);
    });
  });
});