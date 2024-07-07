import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import logger from '../../src/config/logger';
import { ROLES } from '../../src/constants';
import { isJWT } from '../utils';
import { RefreshToken } from '../../src/entity/RefreshToken';
describe('POST /auth/register', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    setTimeout(async () => await connection.destroy(), 100);
  });

  describe('Given All Fields', () => {
    it('Should Return 201', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      const response = await request(app).post('/auth/register').send(userData);

      expect(response.status).toBe(201);
    });

    it('Should Return valid JSON', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      const response = await request(app).post('/auth/register').send(userData);

      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
    });

    it('Should persist the user in the database', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      await request(app).post('/auth/register').send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe('Anshu');
      expect(users[0].lastName).toBe('Babu');
      expect(users[0].email).toBe('vilify.king@gmail.com');
    });

    it('Should return id of created User', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      const response = await request(app).post('/auth/register').send(userData);
      logger.info(response);
      expect(response.body).toHaveProperty('id');
    });

    it('Should assign a customer Role', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      await request(app).post('/auth/register').send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users[0]).toHaveProperty('role');
      expect(users[0].role).toBe(ROLES.CUSTOMER);
    });

    it('Should store hash password in dataBase', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      await request(app).post('/auth/register').send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find({ select: ['password'] });

      expect(users[0].password).not.toBe('Abrajput@123');
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).not.toBe('Abrajput@123');
    });

    it('Should return 400 status code if email is already exits', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      const userRepository = connection.getRepository(User);
      await userRepository.save({ ...userData, role: ROLES.CUSTOMER });

      const response = await request(app).post('/auth/register').send(userData);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(response.status).toBe(400);
    });
  });

  describe('Given Missing Fields', () => {
    it('should return 400 status code if email field is missing', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: '',
        password: 'Abrajput@123',
      };

      const response = await request(app).post('/auth/register').send(userData);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(response.status).toBe(400);
      expect(users).toHaveLength(0);
    });

    it.todo('should return 400 status code if firstName field is missing');
    it.todo('should return 400 status code if lastName field is missing');
    it.todo('should return 400 status code if password field is missing');

    it('should return the access and refresh token inside a cookie', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      const response = await request(app).post('/auth/register').send(userData);

      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      interface Headers {
        ['set-cookie']: string[];
      }

      const cookies =
        (response.headers as unknown as Headers)['set-cookie'] ?? [];

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

    it('should store refresh token in database', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      const response = await request(app).post('/auth/register').send(userData);

      const refreshTokenRepo = connection.getRepository(RefreshToken);

      const tokens = await refreshTokenRepo
        .createQueryBuilder('refreshToken')
        .where('refreshToken.userId = :userId', {
          userId: Number(response.body.id),
        })
        .getMany();

      logger.info('TOKENS:', tokens);
      expect(tokens).toHaveLength(1);
    });
  });

  describe('Fields are not in proper format', () => {
    it('should trim the email field', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: '  vilify.king@gmail.com   ',
        password: 'Abrajput@123',
      };

      await request(app).post('/auth/register').send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].email).toBe('vilify.king@gmail.com');
    });

    // DO WITH THE HELP EXPERESS VALIDATOR
    it.todo('should return 400 status code if email is not in proper format');
    it.todo(
      'should return 400 status code if password is less than 8 characters',
    );
  });
});
