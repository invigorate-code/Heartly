"use client";

import React from "react";
import {
  RoleBasedAccess,
  OwnerOnly,
  AdminOrOwner,
  useHasRole,
  useHasPermission,
} from "@/components/auth/RoleBasedAccess";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";

export const RoleBasedSettingsExample: React.FC = () => {
  const isOwner = useHasRole("OWNER");
  const isAdmin = useHasRole("ADMIN");
  const canManageUsers = useHasPermission("ADMIN"); // ADMIN or OWNER can manage users
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      {/* General Settings - Available to all roles */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">General Settings</h2>
        </CardHeader>
        <CardBody>
          <p>These settings are available to all users.</p>
          <Button className="mt-4">Update Profile</Button>
        </CardBody>
      </Card>
      
      {/* User Management - Only ADMIN and OWNER */}
      <AdminOrOwner>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">User Management</h2>
          </CardHeader>
          <CardBody>
            <p>Manage users in your organization.</p>
            <div className="space-x-2 mt-4">
              <Button color="primary">Invite User</Button>
              <Button>View All Users</Button>
            </div>
          </CardBody>
        </Card>
      </AdminOrOwner>
      
      {/* Facility Management - Only OWNER */}
      <OwnerOnly>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Facility Management</h2>
          </CardHeader>
          <CardBody>
            <p>Manage your facilities and locations.</p>
            <div className="space-x-2 mt-4">
              <Button color="primary">Add Facility</Button>
              <Button color="danger">Delete Facility</Button>
            </div>
          </CardBody>
        </Card>
      </OwnerOnly>
      
      {/* Billing - Only OWNER with custom fallback */}
      <RoleBasedAccess 
        allowedRoles={["OWNER"]} 
        fallback={
          <Card>
            <CardBody>
              <p className="text-gray-500">
                Contact your organization owner to manage billing settings.
              </p>
            </CardBody>
          </Card>
        }
      >
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Billing & Subscription</h2>
          </CardHeader>
          <CardBody>
            <p>Manage your subscription and payment methods.</p>
            <Button color="success" className="mt-4">
              Manage Subscription
            </Button>
          </CardBody>
        </Card>
      </RoleBasedAccess>
      
      {/* Dynamic content based on hooks */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Your Permissions</h2>
        </CardHeader>
        <CardBody>
          <ul className="list-disc list-inside space-y-1">
            <li>View general settings: ✓</li>
            <li>Manage users: {canManageUsers ? "✓" : "✗"}</li>
            <li>Manage facilities: {isOwner ? "✓" : "✗"}</li>
            <li>Manage billing: {isOwner ? "✓" : "✗"}</li>
            <li>Admin privileges: {isAdmin ? "✓" : "✗"}</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};