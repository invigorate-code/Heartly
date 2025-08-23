import { Test, TestingModule } from '@nestjs/testing';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/createFacility.req.dto';
import { UpdateFacilityDto } from './dto/updateFacility.req.dto';
import { FacilityResDto } from './dto/getFacility.res.dto';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UnauthorizedException } from '@nestjs/common';
import { SuperTokensRolesService } from '@/utils/supertokens/roles.service';

describe('FacilityController', () => {
  let controller: FacilityController;
  let service: FacilityService;

  const mockFacilityService = {
    createFacility: jest.fn(),
    getFacilityById: jest.fn(),
    getLoggedInUserFacilities: jest.fn(),
    updateFacility: jest.fn(),
    deleteFacility: jest.fn(),
    restoreFacility: jest.fn(),
  };

  const mockSession = {
    getUserId: jest.fn().mockReturnValue('user-123'),
    getTenantId: jest.fn().mockReturnValue('tenant-456'),
    getAccessTokenPayload: jest.fn(),
  } as unknown as SessionContainer;

  const mockSuperTokensRolesService = {
    getUserRoles: jest.fn(),
    hasRole: jest.fn(),
    addRoleToUser: jest.fn(),
    removeRoleFromUser: jest.fn(),
    createCustomRole: jest.fn(),
    deleteCustomRole: jest.fn(),
    getCustomRoles: jest.fn(),
    updateCustomRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacilityController],
      providers: [
        {
          provide: FacilityService,
          useValue: mockFacilityService,
        },
        {
          provide: SuperTokensRolesService,
          useValue: mockSuperTokensRolesService,
        },
      ],
    }).compile();

    controller = module.get<FacilityController>(FacilityController);
    service = module.get<FacilityService>(FacilityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFacility', () => {
    const createFacilityDto: CreateFacilityDto = {
      name: 'Test Facility',
      address: '123 Test St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      projectedClientCount: 50,
      roomCount: 25,
      tenantId: 'tenant-456',
    };

    const mockFacilityResponse: FacilityResDto = {
      id: 'facility-123',
      name: 'Test Facility',
      address: '123 Test St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      projectedClientCount: 50,
      roomCount: 25,
      tenantId: 'tenant-456',
      isDeleted: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    it('should create facility when email is verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: true },
      });
      mockFacilityService.createFacility.mockResolvedValue(mockFacilityResponse);

      const result = await controller.createFacility(createFacilityDto, mockSession);

      expect(result).toEqual(mockFacilityResponse);
      expect(mockFacilityService.createFacility).toHaveBeenCalledWith(
        createFacilityDto,
        mockSession
      );
    });

    it('should throw UnauthorizedException when email is not verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: false },
      });

      await expect(
        controller.createFacility(createFacilityDto, mockSession)
      ).rejects.toThrow(UnauthorizedException);

      expect(mockFacilityService.createFacility).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when email verification status is missing', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({});

      await expect(
        controller.createFacility(createFacilityDto, mockSession)
      ).rejects.toThrow(UnauthorizedException);

      expect(mockFacilityService.createFacility).not.toHaveBeenCalled();
    });
  });

  describe('getFacilityById', () => {
    const facilityId = 'facility-123';
    const mockFacilityResponse: FacilityResDto = {
      id: facilityId,
      name: 'Test Facility',
      address: '123 Test St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      projectedClientCount: 50,
      roomCount: 25,
      tenantId: 'tenant-456',
      isDeleted: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    it('should get facility when email is verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: true },
      });
      mockFacilityService.getFacilityById.mockResolvedValue(mockFacilityResponse);

      const result = await controller.getFacilityById(facilityId, mockSession);

      expect(result).toEqual(mockFacilityResponse);
      expect(mockFacilityService.getFacilityById).toHaveBeenCalledWith(
        facilityId,
        mockSession
      );
    });

    it('should throw UnauthorizedException when email is not verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: false },
      });

      await expect(
        controller.getFacilityById(facilityId, mockSession)
      ).rejects.toThrow(UnauthorizedException);

      expect(mockFacilityService.getFacilityById).not.toHaveBeenCalled();
    });
  });

  describe('getLoggedInUserFacilities', () => {
    const mockFacilities: FacilityResDto[] = [
      {
        id: 'facility-1',
        name: 'Facility 1',
        address: '123 Test St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        projectedClientCount: 50,
        roomCount: 25,
        tenantId: 'tenant-456',
        isDeleted: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'facility-2',
        name: 'Facility 2',
        address: '456 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        projectedClientCount: 30,
        roomCount: 15,
        tenantId: 'tenant-456',
        isDeleted: false,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    it('should return user facilities when email is verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: true },
      });
      mockFacilityService.getLoggedInUserFacilities.mockResolvedValue(mockFacilities);

      const result = await controller.getLoggedInUserFacilities(mockSession);

      expect(result).toEqual(mockFacilities);
      expect(mockFacilityService.getLoggedInUserFacilities).toHaveBeenCalledWith(
        mockSession
      );
    });

    it('should return empty array when user has no facilities', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: true },
      });
      mockFacilityService.getLoggedInUserFacilities.mockResolvedValue([]);

      const result = await controller.getLoggedInUserFacilities(mockSession);

      expect(result).toEqual([]);
    });

    it('should throw UnauthorizedException when email is not verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: false },
      });

      await expect(
        controller.getLoggedInUserFacilities(mockSession)
      ).rejects.toThrow(UnauthorizedException);

      expect(mockFacilityService.getLoggedInUserFacilities).not.toHaveBeenCalled();
    });
  });

  describe('updateFacility', () => {
    const updateFacilityDto: UpdateFacilityDto = {
      id: 'facility-123',
      name: 'Updated Facility',
      projectedClientCount: 75,
    };

    const mockUpdatedFacility: FacilityResDto = {
      id: 'facility-123',
      name: 'Updated Facility',
      address: '123 Test St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      projectedClientCount: 75,
      roomCount: 25,
      tenantId: 'tenant-456',
      isDeleted: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    };

    it('should update facility when email is verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: true },
      });
      mockFacilityService.updateFacility.mockResolvedValue(mockUpdatedFacility);

      const result = await controller.updateFacility(mockSession, updateFacilityDto);

      expect(result).toEqual(mockUpdatedFacility);
      expect(mockFacilityService.updateFacility).toHaveBeenCalledWith(
        mockSession,
        updateFacilityDto
      );
    });

    it('should throw UnauthorizedException when email is not verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: false },
      });

      await expect(
        controller.updateFacility(mockSession, updateFacilityDto)
      ).rejects.toThrow(UnauthorizedException);

      expect(mockFacilityService.updateFacility).not.toHaveBeenCalled();
    });
  });

  describe('deleteFacility', () => {
    const facilityId = 'facility-123';

    it('should delete facility when email is verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: true },
      });
      mockFacilityService.deleteFacility.mockResolvedValue(undefined);

      await controller.deleteFacility(facilityId, mockSession);

      expect(mockFacilityService.deleteFacility).toHaveBeenCalledWith(
        facilityId,
        mockSession
      );
    });

    it('should throw UnauthorizedException when email is not verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: false },
      });

      await expect(
        controller.deleteFacility(facilityId, mockSession)
      ).rejects.toThrow(UnauthorizedException);

      expect(mockFacilityService.deleteFacility).not.toHaveBeenCalled();
    });
  });

  describe('restoreFacility', () => {
    const facilityId = 'facility-123';
    const mockRestoredFacility: FacilityResDto = {
      id: facilityId,
      name: 'Test Facility',
      address: '123 Test St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      projectedClientCount: 50,
      roomCount: 25,
      tenantId: 'tenant-456',
      isDeleted: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-03'),
    };

    it('should restore facility when email is verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: true },
      });
      mockFacilityService.restoreFacility.mockResolvedValue(mockRestoredFacility);

      const result = await controller.restoreFacility(facilityId, mockSession);

      expect(result).toEqual(mockRestoredFacility);
      expect(mockFacilityService.restoreFacility).toHaveBeenCalledWith(
        facilityId,
        mockSession
      );
    });

    it('should throw UnauthorizedException when email is not verified', async () => {
      mockSession.getAccessTokenPayload = jest.fn().mockReturnValue({
        'st-ev': { v: false },
      });

      await expect(
        controller.restoreFacility(facilityId, mockSession)
      ).rejects.toThrow(UnauthorizedException);

      expect(mockFacilityService.restoreFacility).not.toHaveBeenCalled();
    });
  });
});