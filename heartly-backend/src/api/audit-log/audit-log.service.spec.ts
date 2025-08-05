import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogService } from './audit-log.service';
import { DataAuditLog } from '../../common/entities/data-audit-log.entity';
import { UserEntityEntity } from '../user/entities/user.entity';
import { FacilityEntityEntity } from '../facility/entities/facility.entity';

describe('AuditLogService', () => {
  let service: AuditLogService;
  let auditLogRepository: Repository<DataAuditLog>;
  let userRepository: Repository<UserEntity>;
  let facilityRepository: Repository<FacilityEntity>;

  const mockAuditLogRepository = {
    createQueryBuilder: jest.fn(),
    findByIds: jest.fn(),
    query: jest.fn(),
  };

  const mockUserEntityRepository = {
    findByIds: jest.fn(),
  };

  const mockFacilityEntityRepository = {
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        {
          provide: getRepositoryToken(DataAuditLog),
          useValue: mockAuditLogRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserEntityRepository,
        },
        {
          provide: getRepositoryToken(FacilityEntity),
          useValue: mockFacilityEntityRepository,
        },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
    auditLogRepository = module.get<Repository<DataAuditLog>>(
      getRepositoryToken(DataAuditLog),
    );
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    facilityRepository = module.get<Repository<FacilityEntity>>(
      getRepositoryToken(FacilityEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAccessPermissions', () => {
    it('should allow OWNER role', () => {
      const user = { role: 'OWNER' } as UserEntity;
      expect(() => service['validateAccessPermissions'](user)).not.toThrow();
    });

    it('should allow ADMIN role', () => {
      const user = { role: 'ADMIN' } as UserEntity;
      expect(() => service['validateAccessPermissions'](user)).not.toThrow();
    });

    it('should allow STAFF role', () => {
      const user = { role: 'STAFF' } as UserEntity;
      expect(() => service['validateAccessPermissions'](user)).not.toThrow();
    });

    it('should reject invalid roles', () => {
      const user = { role: 'INVALID' } as UserEntity;
      expect(() => service['validateAccessPermissions'](user)).toThrow();
    });
  });

  describe('exportAuditLogs', () => {
    it('should allow OWNER to export', async () => {
      const user = { role: 'OWNER', tenantId: 'tenant-1' } as UserEntity;
      const query = {
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      };

      mockAuditLogRepository.query.mockResolvedValue([]);

      await service.exportAuditLogs(query, user);

      expect(mockAuditLogRepository.query).toHaveBeenCalledWith(
        expect.stringContaining('export_audit_logs'),
        [query.startDate, query.endDate, user.tenantId, null],
      );
    });

    it('should reject STAFF from exporting', async () => {
      const user = { role: 'STAFF', tenantId: 'tenant-1' } as UserEntity;
      const query = {
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      };

      await expect(service.exportAuditLogs(query, user)).rejects.toThrow(
        'Insufficient permissions to export audit logs',
      );
    });
  });
});