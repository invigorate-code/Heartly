// dto/audit-log.res.dto.ts
import { Expose } from 'class-transformer';

export class SystemAuditLogResDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  action: string;

  @Expose()
  details: Record<string, any>;

  @Expose()
  createdAt: Date;
}
