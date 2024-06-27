import request from 'supertest';
import app from '../../app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../entity/User';
import logger from '../../config/logger';
import { ROLES } from '../../constants';
import { log } from 'console';
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
      const users = await userRepository.find();

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

      log(response.body);
      expect(response.status).toBe(400);
      expect(users).toHaveLength(0);
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
  });
});
