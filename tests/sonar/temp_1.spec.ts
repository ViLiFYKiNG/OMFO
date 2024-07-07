import { Request, Response, NextFunction } from 'express';
import { TenantController } from '../../src/controllers/TenantController';

const mockTenantService = {
  create: jest.fn(),
  update: jest.fn(),
  getById: jest.fn(),
  deleteById: jest.fn(),
};

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
};

const mockRequest = (body = {}, params = {}) =>
  ({
    body,
    params,
  }) as unknown as Request;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe('TenantController', () => {
  let tenantController: TenantController;

  beforeEach(() => {
    tenantController = new TenantController(
      mockTenantService as any,
      mockLogger as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a tenant successfully', async () => {
    const req = mockRequest({ name: 'Test Tenant', address: '123 Test St' });
    const res = mockResponse();
    const tenant = { id: 1, name: 'Test Tenant', address: '123 Test St' };
    mockTenantService.create.mockResolvedValue(tenant);

    await tenantController.create(req, res, mockNext);

    expect(mockTenantService.create).toHaveBeenCalledWith({
      name: 'Test Tenant',
      address: '123 Test St',
    });
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Request for creating a tenant',
      { name: 'Test Tenant', address: '123 Test St' },
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Tenant has been registered:',
      tenant,
    );
    expect(res.send).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: tenant.id });
  });

  it('should handle error during tenant creation', async () => {
    const req = mockRequest({ name: 'Test Tenant', address: '123 Test St' });
    const res = mockResponse();
    const error = new Error('Create tenant failed');
    mockTenantService.create.mockRejectedValue(error);

    await tenantController.create(req, res, mockNext);

    expect(mockTenantService.create).toHaveBeenCalledWith({
      name: 'Test Tenant',
      address: '123 Test St',
    });
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should update a tenant successfully', async () => {
    const req = mockRequest(
      { name: 'Updated Tenant', address: '456 Updated St' },
      { id: '1' },
    );
    const res = mockResponse();
    mockTenantService.update.mockResolvedValue(undefined);

    await tenantController.update(req, res, mockNext);

    expect(mockTenantService.update).toHaveBeenCalledWith(1, {
      name: 'Updated Tenant',
      address: '456 Updated St',
    });
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Request for updating a tenant',
      { name: 'Updated Tenant', address: '456 Updated St' },
    );
    expect(mockLogger.info).toHaveBeenCalledWith('Tenant has been updated', {
      id: '1',
    });
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  it('should get a tenant successfully', async () => {
    const req = mockRequest({}, { id: '1' });
    const res = mockResponse();
    const tenant = { id: 1, name: 'Test Tenant', address: '123 Test St' };
    mockTenantService.getById.mockResolvedValue(tenant);

    await tenantController.getOne(req, res, mockNext);

    expect(mockTenantService.getById).toHaveBeenCalledWith(1);
    expect(mockLogger.info).toHaveBeenCalledWith('Tenant has been fetched');
    expect(res.json).toHaveBeenCalledWith(tenant);
  });

  it('should delete a tenant successfully', async () => {
    const req = mockRequest({}, { id: '1' });
    const res = mockResponse();
    mockTenantService.deleteById.mockResolvedValue(undefined);

    await tenantController.destroy(req, res, mockNext);

    expect(mockTenantService.deleteById).toHaveBeenCalledWith(1);
    expect(mockLogger.info).toHaveBeenCalledWith('Tenant has been deleted', {
      id: 1,
    });
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });
});
