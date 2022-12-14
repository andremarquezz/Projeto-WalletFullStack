import request from 'supertest';
import app from '../../app';

describe('<POST /login>', () => {
  describe('When invalid fields', () => {
    it('Should return error 400 with a details message when missing username field', async () => {
      const response = await request(app).post('/login').send({
        password: '12345678',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'username and password is required' });
    });

    it('Should return error 404 when username is incorrect', async () => {
      const response = await request(app).post('/login').send({
        username: 'John Doe',
        password: 'secret_admin',
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Incorrect username' });
    });

    it('Should return error 401 when password is incorrect', async () => {
      const response = await request(app).post('/login').send({
        username: 'Admin',
        password: 'aniversario',
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Incorrect password' });
    });
  });

  describe('When valid fields', () => {
    it('Should return a 200 status with a JWT token when the information is valid', async () => {
      const response = await request(app).post('/login').send({
        username: 'Admin',
        password: 'secret_admin',
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });
  describe('<GET user/:id>', () => {
    describe('When invalid fields', () => {
      it('Should return error 401 with a details message when missing token', async () => {
        const response = await request(app).get('/transaction');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'token not found' });
      });
    });
    describe('When valid fields', () => {
      it('Should return status 200 with a detail message when username is valid', async () => {
        const {
          body: { token },
        } = await request(app).post('/login').send({
          username: 'Admin',
          password: 'secret_admin',
        });
        const response = await request(app).get('/user/1').set({ authorization: token });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ user: 'Admin' });
      });
    });
  });
});
