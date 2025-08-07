'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { toast } from 'react-hot-toast';
import { RoleBasedAccess, AdminOrOwner } from '@/components/auth/RoleBasedAccess';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'ADMIN' | 'STAFF';
  isActive: boolean;
  lastLogin?: string;
}

interface PasswordResetAudit {
  id: string;
  resetByUserId: string;
  targetUserId: string;
  resetMethod: 'self_service' | 'administrative' | 'temp_password';
  success: boolean;
  errorMessage?: string;
  createdAt: string;
  expiresAt?: string;
  usedAt?: string;
}

interface TempPasswordResponse {
  tempPassword: string;
  tempPasswordToken: string;
  expiresAt: string;
  auditId: string;
}

export default function PasswordManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [auditHistory, setAuditHistory] = useState<PasswordResetAudit[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [resetReason, setResetReason] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tempPasswordResult, setTempPasswordResult] = useState<TempPasswordResponse | null>(null);
  
  const { isOpen: isResetModalOpen, onOpen: onResetModalOpen, onOpenChange: onResetModalOpenChange } = useDisclosure();
  const { isOpen: isResultModalOpen, onOpen: onResultModalOpen, onOpenChange: onResultModalOpenChange } = useDisclosure();
  const { isOpen: isAuditModalOpen, onOpen: onAuditModalOpen, onOpenChange: onAuditModalOpenChange } = useDisclosure();

  // Load users and audit history
  useEffect(() => {
    loadUsers();
    loadAuditHistory();
  }, []);

  const loadUsers = async () => {
    try {
      // This would be your actual API call to get users
      const response = await fetch('/api/users');
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      // Mock data for demonstration
      setUsers([
        {
          id: '1',
          email: 'admin@facility.com',
          firstName: 'John',
          lastName: 'Admin',
          role: 'ADMIN',
          isActive: true,
          lastLogin: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          email: 'staff@facility.com',
          firstName: 'Jane',
          lastName: 'Staff',
          role: 'STAFF',
          isActive: true,
          lastLogin: '2024-01-14T14:20:00Z',
        },
      ]);
    }
  };

  const loadAuditHistory = async () => {
    try {
      const response = await fetch('/api/auth/password-reset/audit-history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        const auditData = await response.json();
        setAuditHistory(auditData);
      }
    } catch (error) {
      console.error('Failed to load audit history:', error);
      // Mock data for demonstration
      setAuditHistory([
        {
          id: '1',
          resetByUserId: 'owner-id',
          targetUserId: '2',
          resetMethod: 'administrative',
          success: true,
          createdAt: '2024-01-15T09:30:00Z',
          expiresAt: '2024-01-16T09:30:00Z',
          usedAt: '2024-01-15T10:45:00Z',
        },
      ]);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/password-reset/admin/reset-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          reason: resetReason || 'Administrative password reset',
          sendEmail,
        }),
      });

      if (response.ok) {
        const result: TempPasswordResponse = await response.json();
        setTempPasswordResult(result);
        toast.success('Temporary password generated successfully!');
        onResetModalOpenChange();
        onResultModalOpen();
        loadAuditHistory(); // Refresh audit history
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openResetModal = (user: User) => {
    setSelectedUser(user);
    setResetReason('');
    setSendEmail(true);
    onResetModalOpen();
  };

  const canResetUser = (userRole: string, currentUserRole: string) => {
    if (currentUserRole === 'OWNER') return true;
    if (currentUserRole === 'ADMIN' && userRole === 'STAFF') return true;
    return false;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getResetMethodColor = (method: string) => {
    switch (method) {
      case 'self_service':
        return 'success';
      case 'administrative':
        return 'warning';
      case 'temp_password':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <AdminOrOwner fallback={<div className="p-6 text-center text-red-600">Access denied. ADMIN or OWNER role required.</div>}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Password Management</h1>
            <p className="text-gray-600">Manage user passwords and view reset history</p>
          </div>
          <Button
            color="secondary"
            variant="bordered"
            onClick={onAuditModalOpen}
          >
            View Audit History
          </Button>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">User Management</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Users table">
              <TableHeader>
                <TableColumn>USER</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>LAST LOGIN</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={user.role === 'OWNER' ? 'success' : user.role === 'ADMIN' ? 'warning' : 'default'}
                        variant="flat"
                        size="sm"
                      >
                        {user.role}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={user.isActive ? 'success' : 'danger'}
                        variant="flat"
                        size="sm"
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button size="sm" variant="light">Actions</Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem
                            key="reset"
                            className="text-warning"
                            onClick={() => openResetModal(user)}
                          >
                            Reset Password
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Password Reset Modal */}
        <Modal isOpen={isResetModalOpen} onOpenChange={onResetModalOpenChange} size="lg">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Reset Password for {selectedUser?.firstName} {selectedUser?.lastName}
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                      <p className="text-sm text-amber-800">
                        <strong>Warning:</strong> This will generate a temporary password for the user. 
                        Their current password will remain valid until they use the temporary password to set a new one.
                      </p>
                    </div>

                    <Textarea
                      label="Reason for Password Reset"
                      placeholder="Enter the reason for resetting this user's password..."
                      value={resetReason}
                      onChange={(e) => setResetReason(e.target.value)}
                      maxRows={3}
                    />

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sendEmail"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="sendEmail" className="text-sm">
                        Send temporary password via email
                      </label>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="warning"
                    onPress={handleResetPassword}
                    isLoading={isLoading}
                  >
                    Generate Temporary Password
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Temporary Password Result Modal */}
        <Modal isOpen={isResultModalOpen} onOpenChange={onResultModalOpenChange} size="lg">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Temporary Password Generated
                </ModalHeader>
                <ModalBody>
                  {tempPasswordResult && (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <p className="text-sm text-green-800 mb-2">
                          <strong>✅ Temporary password created successfully!</strong>
                        </p>
                        <p className="text-xs text-green-700">
                          The user will receive instructions via email on how to use this temporary password.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900 mb-2">Temporary Password:</h4>
                        <div className="bg-white border-2 border-dashed border-gray-300 p-3 rounded text-center">
                          <code className="text-lg font-mono text-blue-600">{tempPasswordResult.tempPassword}</code>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p><strong>Expires:</strong> {formatDate(tempPasswordResult.expiresAt)}</p>
                        <p><strong>Audit ID:</strong> {tempPasswordResult.auditId}</p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Next Steps:</strong>
                        </p>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                          <li>• The user will receive an email with login instructions</li>
                          <li>• They must set a new password on first login with the temporary password</li>
                          <li>• The temporary password expires in 24 hours</li>
                          <li>• This action has been logged for audit purposes</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Done
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Audit History Modal */}
        <Modal isOpen={isAuditModalOpen} onOpenChange={onAuditModalOpenChange} size="5xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Password Reset Audit History
                </ModalHeader>
                <ModalBody>
                  <Table aria-label="Password reset audit history">
                    <TableHeader>
                      <TableColumn>DATE</TableColumn>
                      <TableColumn>TARGET USER</TableColumn>
                      <TableColumn>METHOD</TableColumn>
                      <TableColumn>STATUS</TableColumn>
                      <TableColumn>EXPIRES/USED</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {auditHistory.map((audit) => (
                        <TableRow key={audit.id}>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(audit.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              User ID: {audit.targetUserId}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={getResetMethodColor(audit.resetMethod) as any}
                              variant="flat"
                              size="sm"
                            >
                              {audit.resetMethod.replace('_', ' ').toUpperCase()}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={audit.success ? 'success' : 'danger'}
                              variant="flat"
                              size="sm"
                            >
                              {audit.success ? 'Success' : 'Failed'}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              {audit.expiresAt && (
                                <div>Expires: {formatDate(audit.expiresAt)}</div>
                              )}
                              {audit.usedAt && (
                                <div>Used: {formatDate(audit.usedAt)}</div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </AdminOrOwner>
  );
}