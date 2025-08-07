import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';
import { RlsContext, RlsContextService } from './rls-context.service';

describe('RlsContextService', () => {
  let service: RlsContextService;
  let dataSource: jest.Mocked<DataSource>;
  let queryRunner: jest.Mocked<QueryRunner>;

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      release: jest.fn(),
      query: jest.fn(),
    } as any;

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
      query: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RlsContextService,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<RlsContextService>(RlsContextService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createContextualQueryRunner', () => {
    it('should create and configure query runner with RLS context', async () => {
      const context: RlsContext = {
        tenantId: 'tenant-123',
        userId: 'user-456',
        userRole: 'ADMIN',
      };

      queryRunner.query.mockResolvedValue(undefined);

      const result = await service.createContextualQueryRunner(context);

      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.query).toHaveBeenCalledWith(
        `SELECT set_config('app.tenant_id', $1, true)`,
        ['tenant-123'],
      );
      expect(queryRunner.query).toHaveBeenCalledWith(
        `SELECT set_config('app.user_id', $1, true)`,
        ['user-456'],
      );
      expect(queryRunner.query).toHaveBeenCalledWith(
        `SELECT set_config('app.user_role', $1, true)`,
        ['ADMIN'],
      );
      expect(result).toBe(queryRunner);
    });

    it('should release query runner on error', async () => {
      const context: RlsContext = {
        tenantId: 'tenant-123',
        userId: 'user-456',
        userRole: 'ADMIN',
      };

      queryRunner.query.mockRejectedValue(new Error('Database error'));

      await expect(
        service.createContextualQueryRunner(context),
      ).rejects.toThrow('Database error');
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('withRlsContext', () => {
    it('should execute callback with RLS context and clean up', async () => {
      const context: RlsContext = {
        tenantId: 'tenant-123',
        userId: 'user-456',
        userRole: 'STAFF',
      };

      const callback = jest.fn().mockResolvedValue('test-result');
      queryRunner.query.mockResolvedValue(undefined);

      const result = await service.withRlsContext(context, callback);

      expect(callback).toHaveBeenCalledWith(queryRunner);
      expect(result).toBe('test-result');
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should clean up on callback error', async () => {
      const context: RlsContext = {
        tenantId: 'tenant-123',
        userId: 'user-456',
        userRole: 'STAFF',
      };

      const callback = jest.fn().mockRejectedValue(new Error('Callback error'));
      queryRunner.query.mockResolvedValue(undefined);

      await expect(service.withRlsContext(context, callback)).rejects.toThrow(
        'Callback error',
      );
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('setGlobalRlsContext', () => {
    it('should set RLS context globally', async () => {
      const context: RlsContext = {
        tenantId: 'tenant-123',
        userId: 'user-456',
        userRole: 'OWNER',
      };

      dataSource.query.mockResolvedValue(undefined);

      await service.setGlobalRlsContext(context);

      expect(dataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.tenant_id', $1, true)`,
        ['tenant-123'],
      );
      expect(dataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.user_id', $1, true)`,
        ['user-456'],
      );
      expect(dataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.user_role', $1, true)`,
        ['OWNER'],
      );
    });
  });

  describe('clearGlobalRlsContext', () => {
    it('should clear RLS context globally', async () => {
      dataSource.query.mockResolvedValue(undefined);

      await service.clearGlobalRlsContext();

      expect(dataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.tenant_id', '', true)`,
      );
      expect(dataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.user_id', '', true)`,
      );
      expect(dataSource.query).toHaveBeenCalledWith(
        `SELECT set_config('app.user_role', '', true)`,
      );
    });
  });

  describe('getCurrentRlsContext', () => {
    it('should return current RLS context when all values are set', async () => {
      dataSource.query
        .mockResolvedValueOnce([{ value: 'tenant-123' }])
        .mockResolvedValueOnce([{ value: 'user-456' }])
        .mockResolvedValueOnce([{ value: 'ADMIN' }]);

      const result = await service.getCurrentRlsContext();

      expect(result).toEqual({
        tenantId: 'tenant-123',
        userId: 'user-456',
        userRole: 'ADMIN',
      });
    });

    it('should return null when values are not set', async () => {
      dataSource.query
        .mockResolvedValueOnce([{ value: null }])
        .mockResolvedValueOnce([{ value: null }])
        .mockResolvedValueOnce([{ value: null }]);

      const result = await service.getCurrentRlsContext();

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      dataSource.query.mockRejectedValue(new Error('Database error'));

      const result = await service.getCurrentRlsContext();

      expect(result).toBeNull();
    });
  });
});
