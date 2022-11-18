/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import resetDatabase from './assets/resetDatabase';

describe('<POST /register>', () => {
  beforeAll(() => {
    resetDatabase();
  });

  afterAll(() => {
    resetDatabase();
  });

  describe('When invalid fields', () => {
    it('Should return error 400 with a details message when missing username field', async () => {
      const response = await request(app).post('/register').send({
        password: '12345678',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'username and password is required' });
    });

    it('Should return error 400 with a details message when missing password field', async () => {
      const response = await request(app).post('/register').send({
        username: 'John Doe',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'username and password is required' });
    });

    it('Should return error 400 with a detail message when username is less than 3 characters', async () => {
      const response = await request(app).post('/register').send({
        username: 'zé',
        password: '123aniversarioDaEsposa',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'username must be at least 3 characters' });
    });

    it('Should return error 400 with a detail message when password is less than 8 characters', async () => {
      const response = await request(app).post('/register').send({
        username: 'senhorzezinho',
        password: 'ze',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'password must be at least 8 characters' });
    });

    it('Should return error 409 with a detail message when username already exists', async () => {
      const response = await request(app).post('/register').send({
        username: 'Admin',
        password: 'senhaSegura',
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'username already exists' });
    });

    it('Should return error 400 with a detail message when the password does not have at least one uppercase, lowercase letter, and number', async () => {
      const response = await request(app).post('/register').send({
        username: 'John',
        password: '12345678',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error:
          'The password must have at least one uppercase, lowercase letter and number',
      });
    });
  });

  describe('When valid fields', () => {
    it('Should return a 201 status with a JWT token when the information is valid', async () => {
      const response = await request(app).post('/register').send({
        username: 'Jeyz',
        password: '2607Andre',
      });

      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
    });
  });
});
