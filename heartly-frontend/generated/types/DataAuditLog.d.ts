export interface DataAuditLog {
  id: string;
  tableName: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  rowId: string;
  userId?: string;
  tenantId?: string;
  facilityId?: string;
  timestamp: Date;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changedFields?: string[];
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}
