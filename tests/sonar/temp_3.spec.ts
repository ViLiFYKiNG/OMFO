import {
  UserData,
  RegisterUserRequest,
  AuthRequest,
  AuthCookie,
  IRefreshTokenPayload,
  ITenant,
  CreateTenantRequest,
  CreateUserRequest,
  LimitedUserData,
  UpdateUserRequest,
  UserQueryParams,
  TenantQueryParams,
} from '../../src/types';

describe('TypeScript Interfaces', () => {
  it('should create a valid UserData object', () => {
    const user: UserData = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      role: 'admin',
      tenantId: 1,
    };
    expect(user).toBeDefined();
  });

  it('should create a valid RegisterUserRequest object', () => {
    const req: RegisterUserRequest = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
      },
    } as unknown as RegisterUserRequest;
    expect(req.body).toBeDefined();
  });

  it('should create a valid AuthRequest object', () => {
    const req: AuthRequest = {
      auth: {
        id: '1',
        sub: 'john.doe',
        role: 'admin',
      },
    } as unknown as AuthRequest;
    expect(req.auth).toBeDefined();
  });

  it('should create a valid AuthCookie object', () => {
    const cookie: AuthCookie = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };
    expect(cookie).toBeDefined();
  });

  it('should create a valid IRefreshTokenPayload object', () => {
    const payload: IRefreshTokenPayload = {
      id: '1',
    };
    expect(payload).toBeDefined();
  });

  it('should create a valid ITenant object', () => {
    const tenant: ITenant = {
      name: 'TenantName',
      address: 'TenantAddress',
    };
    expect(tenant).toBeDefined();
  });

  it('should create a valid CreateTenantRequest object', () => {
    const req: CreateTenantRequest = {
      body: {
        name: 'TenantName',
        address: 'TenantAddress',
      },
    } as unknown as CreateTenantRequest;
    expect(req.body).toBeDefined();
  });

  it('should create a valid CreateUserRequest object', () => {
    const req: CreateUserRequest = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
      },
    } as unknown as CreateUserRequest;
    expect(req.body).toBeDefined();
  });

  it('should create a valid LimitedUserData object', () => {
    const limitedUser: LimitedUserData = {
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      email: 'john.doe@example.com',
      tenantId: 1,
    };
    expect(limitedUser).toBeDefined();
  });

  it('should create a valid UpdateUserRequest object', () => {
    const req: UpdateUserRequest = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        email: 'john.doe@example.com',
        tenantId: 1,
      },
    } as unknown as UpdateUserRequest;
    expect(req.body).toBeDefined();
  });

  it('should create a valid UserQueryParams object', () => {
    const params: UserQueryParams = {
      perPage: 10,
      currentPage: 1,
      q: 'query',
      role: 'admin',
    };
    expect(params).toBeDefined();
  });

  it('should create a valid TenantQueryParams object', () => {
    const params: TenantQueryParams = {
      q: 'query',
      perPage: 10,
      currentPage: 1,
    };
    expect(params).toBeDefined();
  });
});
