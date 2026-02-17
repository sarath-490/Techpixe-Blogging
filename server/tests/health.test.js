const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Health Check Endpoint', () => {
  it('should return 200 and welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('AI Blog API is running...');
  });
  
  afterAll(async () => {
      await mongoose.connection.close();
  });
});
