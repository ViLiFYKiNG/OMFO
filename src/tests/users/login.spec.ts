import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { ROLES } from '../../constants';
import { User } from '../../entity/User';
import request from 'supertest';
import app from '../../app';
import { isJWT } from '../utils';
import bcrypt from 'bcrypt';

describe('POST /auth/login', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should return the access token and refresh token inside a cookie', async () => {
      // Arrange
      const userData = {
        firstName: 'Rakesh',
        lastName: 'K',
        email: 'rakesh@mern.space',
        password: 'password',
      };

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const userRepository = connection.getRepository(User);
      await userRepository.save({
        ...userData,
        password: hashedPassword,
        role: ROLES.CUSTOMER,
      });

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send({ email: userData.email, password: userData.password });

      interface Headers {
        ['set-cookie']: string[];
      }
      // Assert
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      const cookies =
        (response.headers as unknown as Headers)['set-cookie'] || [];
      cookies.forEach((cookie) => {
        if (cookie.startsWith('accessToken=')) {
          accessToken = cookie.split(';')[0].split('=')[1];
        }

        if (cookie.startsWith('refreshToken=')) {
          refreshToken = cookie.split(';')[0].split('=')[1];
        }
      });
      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();

      expect(isJWT(accessToken)).toBeTruthy();
      expect(isJWT(refreshToken)).toBeTruthy();
    });

    it('should return the 400 if email or password is wrong', async () => {
      // Arrange
      const userData = {
        firstName: 'Rakesh',
        lastName: 'K',
        email: 'rakesh@mern.space',
        password: 'password',
      };

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const userRepository = connection.getRepository(User);
      await userRepository.save({
        ...userData,
        password: hashedPassword,
        role: ROLES.CUSTOMER,
      });

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send({ email: userData.email, password: 'wrongPassword' });

      // Assert
      expect(response.statusCode).toBe(400);
    });
  });
});
