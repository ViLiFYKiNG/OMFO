import request from 'supertest';
import app from '../../app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { truncateTables } from '../utils';
import { User } from '../../entity/User';
describe('POST /auth/register', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await truncateTables(connection);
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
      expect(users[0].password).toBe('Abrajput@123');
    });

    it('Should return id of created User', async () => {
      const userData = {
        firstName: 'Anshu',
        lastName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      const response = await request(app).post('/auth/register').send(userData);
      expect(response.body).toHaveProperty('id');
    });
  });
});
