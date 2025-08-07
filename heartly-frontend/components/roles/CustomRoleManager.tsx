"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Chip,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { OwnerOnly } from "@/components/auth/RoleBasedAccess";
import { useUser } from "@/shared/context/UserContext";

interface CustomRole {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  isActive: boolean;
  tenantId: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface SystemRole {
  name: string;
  displayName: string;
  isSystem: true;
  permissions: string[];
}

interface RoleData {
  systemRoles: SystemRole[];
  customRoles: CustomRole[];
}

const PERMISSION_CATEGORIES = {
  "Users": ["users:read", "users:write", "users:delete", "users:invite"],
  "Facilities": ["facilities:read", "facilities:write", "facilities:delete"],
  "Clients": ["clients:read", "clients:write", "clients:delete"],
  "Audit": ["audit:read", "audit:export"],
  "Roles": ["roles:read", "roles:manage", "roles:create", "roles:delete"],
  "Tenant": ["tenant:manage"],
};

export const CustomRoleManager: React.FC = () => {
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    permissions: [] as string[],
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { getUserId, getTenantId } = useUser();

  // Load roles and permissions
  useEffect(() => {
    loadRolesAndPermissions();
  }, []);

  const loadRolesAndPermissions = async () => {
    try {
      setLoading(true);
      
      // Load roles
      const rolesResponse = await fetch("/api/custom-roles");
      const roles = await rolesResponse.json();
      setRoleData(roles);

      // Load available permissions
      const permissionsResponse = await fetch("/api/custom-roles/permissions");
      const { permissions } = await permissionsResponse.json();
      setAvailablePermissions(permissions);
    } catch (error) {
      console.error("Failed to load roles and permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsEditing(false);
    setFormData({
      name: "",
      displayName: "",
      description: "",
      permissions: [],
    });
    onOpen();
  };

  const handleEditRole = (role: CustomRole) => {
    setSelectedRole(role);
    setIsEditing(true);
    setFormData({
      name: role.name,
      displayName: role.displayName,
      description: role.description || "",
      permissions: role.permissions,
    });
    onOpen();
  };

  const handleDeleteRole = (role: CustomRole) => {
    setSelectedRole(role);
    onDeleteOpen();
  };

  const handleSaveRole = async () => {
    try {
      const url = isEditing 
        ? `/api/custom-roles/${selectedRole?.id}` 
        : "/api/custom-roles";
      
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadRolesAndPermissions();
        onClose();
      } else {
        const error = await response.json();
        console.error("Failed to save role:", error);
      }
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;

    try {
      const response = await fetch(`/api/custom-roles/${selectedRole.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadRolesAndPermissions();
        onDeleteClose();
      } else {
        const error = await response.json();
        console.error("Failed to delete role:", error);
      }
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  const getPermissionsByCategory = () => {
    const categorized: { [key: string]: string[] } = {};
    
    Object.entries(PERMISSION_CATEGORIES).forEach(([category, permissions]) => {
      categorized[category] = permissions.filter(p => 
        availablePermissions.includes(p)
      );
    });

    // Add uncategorized permissions
    const categorizedPerms = Object.values(PERMISSION_CATEGORIES).flat();
    const uncategorized = availablePermissions.filter(p => 
      !categorizedPerms.includes(p)
    );
    
    if (uncategorized.length > 0) {
      categorized["Other"] = uncategorized;
    }

    return categorized;
  };

  if (loading) {
    return <div className="p-6">Loading roles...</div>;
  }

  return (
    <OwnerOnly fallback={
      <Card className="p-6">
        <CardBody>
          <p className="text-gray-500">
            Only organization owners can manage custom roles.
          </p>
        </CardBody>
      </Card>
    }>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Role Management</h1>
          <Button 
            color="primary" 
            onPress={handleCreateRole}
            className="font-medium"
          >
            Create Custom Role
          </Button>
        </div>

        {/* System Roles */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">System Roles</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">
              These are the default roles available to all tenants. They cannot be modified or deleted.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roleData?.systemRoles.map((role) => (
                <Card key={role.name} className="border">
                  <CardBody>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{role.displayName}</h3>
                      <Chip size="sm" variant="flat" color="default">
                        System
                      </Chip>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {role.permissions.length} permissions
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Chip key={permission} size="sm" variant="flat" color="primary">
                          {permission}
                        </Chip>
                      ))}
                      {role.permissions.length > 3 && (
                        <Chip size="sm" variant="flat" color="default">
                          +{role.permissions.length - 3} more
                        </Chip>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Custom Roles */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Custom Roles</h2>
          </CardHeader>
          <CardBody>
            {!roleData?.customRoles.length ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No custom roles created yet.</p>
                <Button color="primary" onPress={handleCreateRole}>
                  Create Your First Custom Role
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roleData.customRoles.map((role) => (
                  <Card key={role.id} className="border">
                    <CardBody>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{role.displayName}</h3>
                        <Chip size="sm" variant="flat" color="success">
                          Custom
                        </Chip>
                      </div>
                      {role.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {role.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mb-3">
                        {role.permissions.length} permissions
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Chip key={permission} size="sm" variant="flat" color="secondary">
                            {permission}
                          </Chip>
                        ))}
                        {role.permissions.length > 3 && (
                          <Chip size="sm" variant="flat" color="default">
                            +{role.permissions.length - 3} more
                          </Chip>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="flat"
                          onPress={() => handleEditRole(role)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          color="danger" 
                          variant="flat"
                          onPress={() => handleDeleteRole(role)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Create/Edit Role Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          size="3xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>
              {isEditing ? "Edit Custom Role" : "Create Custom Role"}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Role Name"
                    placeholder="e.g., nurse_supervisor"
                    value={formData.name}
                    onValueChange={(value) => 
                      setFormData({ ...formData, name: value })
                    }
                    isDisabled={isEditing} // Role names can't be changed
                    description="Internal name (lowercase, underscores allowed)"
                  />
                  <Input
                    label="Display Name"
                    placeholder="e.g., Nurse Supervisor"
                    value={formData.displayName}
                    onValueChange={(value) => 
                      setFormData({ ...formData, displayName: value })
                    }
                    description="Human-readable name"
                  />
                </div>
                
                <Textarea
                  label="Description"
                  placeholder="Brief description of this role's purpose"
                  value={formData.description}
                  onValueChange={(value) => 
                    setFormData({ ...formData, description: value })
                  }
                />

                <Divider />

                <div>
                  <h3 className="font-semibold mb-3">Permissions</h3>
                  <div className="space-y-4">
                    {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                      <div key={category}>
                        <h4 className="font-medium text-sm mb-2">{category}</h4>
                        <CheckboxGroup
                          value={formData.permissions}
                          onValueChange={(value) => 
                            setFormData({ ...formData, permissions: value })
                          }
                        >
                          <div className="grid gap-2 md:grid-cols-2">
                            {permissions.map((permission) => (
                              <Checkbox key={permission} value={permission}>
                                <span className="text-sm">{permission}</span>
                              </Checkbox>
                            ))}
                          </div>
                        </CheckboxGroup>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onPress={handleSaveRole}
                isDisabled={!formData.name || !formData.displayName || formData.permissions.length === 0}
              >
                {isEditing ? "Update Role" : "Create Role"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete the role "{selectedRole?.displayName}"?
              </p>
              <p className="text-sm text-gray-600 mt-2">
                This action cannot be undone. Users with this role will lose these permissions.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onDeleteClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleConfirmDelete}>
                Delete Role
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </OwnerOnly>
  );
};