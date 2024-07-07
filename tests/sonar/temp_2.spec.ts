// userController.test.ts

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { UserController } from '../../src/controllers/UserController';

jest.mock('express-validator');

const mockUserService = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
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
  return res;
};

const mockNext: NextFunction = jest.fn();

describe('UserController', () => {
  let userController: UserController;

  beforeEach(() => {
    userController = new UserController(
      mockUserService as any,
      mockLogger as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    const req = mockRequest({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      tenantId: 1,
      role: 'user',
    });
    const res = mockResponse();
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    const user = { id: 1 };
    mockUserService.create.mockResolvedValue(user);

    await userController.create(req, res, mockNext);

    expect(mockUserService.create).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      role: 'user',
      tenantId: 1,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: user.id });
  });

  it('should handle error during user creation', async () => {
    const req = mockRequest({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      tenantId: 1,
      role: 'user',
    });
    const res = mockResponse();
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    const error = new Error('Create user failed');
    mockUserService.create.mockRejectedValue(error);

    await userController.create(req, res, mockNext);

    expect(mockUserService.create).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      role: 'user',
      tenantId: 1,
    });
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should update a user successfully', async () => {
    const req = mockRequest(
      {
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        email: 'john.doe@example.com',
        tenantId: 1,
      },
      { id: '1' },
    );
    const res = mockResponse();
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    mockUserService.update.mockResolvedValue(undefined);

    await userController.update(req, res, mockNext);

    expect(mockUserService.update).toHaveBeenCalledWith(1, {
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      email: 'john.doe@example.com',
      tenantId: 1,
    });
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Request for updating a user',
      {
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        email: 'john.doe@example.com',
        tenantId: 1,
      },
    );
    expect(mockLogger.info).toHaveBeenCalledWith('User has been updated', {
      id: '1',
    });
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  it('should handle error during user update', async () => {
    const req = mockRequest(
      {
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        email: 'john.doe@example.com',
        tenantId: 1,
      },
      { id: '1' },
    );
    const res = mockResponse();
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    const error = new Error('Update user failed');
    mockUserService.update.mockRejectedValue(error);

    await userController.update(req, res, mockNext);

    expect(mockUserService.update).toHaveBeenCalledWith(1, {
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      email: 'john.doe@example.com',
      tenantId: 1,
    });
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should get a user successfully', async () => {
    const req = mockRequest({}, { id: '1' });
    const res = mockResponse();
    const user = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      tenantId: 1,
      role: 'user',
    };
    mockUserService.findById.mockResolvedValue(user);

    await userController.getOne(req, res, mockNext);

    expect(mockUserService.findById).toHaveBeenCalledWith(1);
    expect(mockLogger.info).toHaveBeenCalledWith('User has been fetched', {
      id: user.id,
    });
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('should handle error during getting a user', async () => {
    const req = mockRequest({}, { id: '1' });
    const res = mockResponse();
    const error = new Error('Get user failed');
    mockUserService.findById.mockRejectedValue(error);

    await userController.getOne(req, res, mockNext);

    expect(mockUserService.findById).toHaveBeenCalledWith(1);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should delete a user successfully', async () => {
    const req = mockRequest({}, { id: '1' });
    const res = mockResponse();
    mockUserService.deleteById.mockResolvedValue(undefined);

    await userController.destroy(req, res, mockNext);

    expect(mockUserService.deleteById).toHaveBeenCalledWith(1);
    expect(mockLogger.info).toHaveBeenCalledWith('User has been deleted', {
      id: 1,
    });
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  it('should handle error during deleting a user', async () => {
    const req = mockRequest({}, { id: '1' });
    const res = mockResponse();
    const error = new Error('Delete user failed');
    mockUserService.deleteById.mockRejectedValue(error);

    await userController.destroy(req, res, mockNext);

    expect(mockUserService.deleteById).toHaveBeenCalledWith(1);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
