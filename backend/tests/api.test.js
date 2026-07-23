import request from 'supertest';
import mongoose from 'mongoose';
import { app, server } from '../server.js';
import User from '../models/User.js';

// Close server and database connection after tests
afterAll(async () => {
  await User.deleteMany({ email: 'test_temp@foodapp.com' });
  await mongoose.connection.close();
  server.close();
});

describe('MERN Restaurant API Authentication & Menu integration', () => {
  
  describe('POST /api/auth/register', () => {
    it('should register a new customer user successfully', async () => {
      // Clean up first if user exists
      await User.deleteOne({ email: 'test_temp@foodapp.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Temporary Tester',
          email: 'test_temp@foodapp.com',
          password: 'password123',
          role: 'customer',
          phone: '1112223333'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toEqual('test_temp@foodapp.com');
    }, 20000);

    it('should reject registration if email is duplicate', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Temporary Tester 2',
          email: 'test_temp@foodapp.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test_temp@foodapp.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject authentication for wrong credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test_temp@foodapp.com',
          password: 'wrong_password'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/menu', () => {
    it('should return menu list', async () => {
      const res = await request(app)
        .get('/api/menu');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
