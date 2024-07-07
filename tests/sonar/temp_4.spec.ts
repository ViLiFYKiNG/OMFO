// validators/updateUserValidator.test.ts

import request from 'supertest';
import app from '../../src/app';

describe('Update User Validator', () => {
  it('should fail if firstName is missing', async () => {
    const response = await request(app).post('/update-user').send({
      lastName: 'Doe',
      role: 'user',
      email: 'john.doe@example.com',
      tenantId: 1,
    });
    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('First name is required!');
  });

  it('should fail if lastName is missing', async () => {
    const response = await request(app).post('/update-user').send({
      firstName: 'John',
      role: 'user',
      email: 'john.doe@example.com',
      tenantId: 1,
    });
    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('Last name is required!');
  });

  it('should fail if role is missing', async () => {
    const response = await request(app).post('/update-user').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      tenantId: 1,
    });
    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('Role is required!');
  });

  it('should fail if email is invalid', async () => {
    const response = await request(app).post('/update-user').send({
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      email: 'invalid-email',
      tenantId: 1,
    });
    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('Invalid email!');
  });

  it('should fail if tenantId is missing and role is not admin', async () => {
    const response = await request(app).post('/update-user').send({
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      email: 'john.doe@example.com',
    });
    expect(response.status).toBe(200);
  });

  it('should pass if all fields are valid', async () => {
    const response = await request(app).post('/update-user').send({
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      email: 'john.doe@example.com',
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
  });

  it('should pass if tenantId is missing but role is admin', async () => {
    const response = await request(app).post('/update-user').send({
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      email: 'john.doe@example.com',
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
  });
});
