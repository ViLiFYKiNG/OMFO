import request from 'supertest';
import app from '../../src/app';
describe('POST /auth/register', () => {
  describe('Given All Fields', () => {
    it('Should Return 201', async () => {
      const userData = {
        firstName: 'Anshu',
        lstatName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      const response = await request(app).post('/auth/register').send(userData);

      expect(response.status).toBe(201);
    });

    it('Should Return valid JSON', async () => {
      const userData = {
        firstName: 'Anshu',
        lstatName: 'Babu',
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
        lstatName: 'Babu',
        email: 'vilify.king@gmail.com',
        password: 'Abrajput@123',
      };

      const response = await request(app).post('/auth/register').send(userData);

      console.log(response.body);
    });
  });
});
