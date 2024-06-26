import app from '../app';
import request from 'supertest';

describe('APP', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('it should return 200 status code', async () => {
    const response = await request(app).get('/').send();
    expect(response.status).toBe(200);
  });
});
