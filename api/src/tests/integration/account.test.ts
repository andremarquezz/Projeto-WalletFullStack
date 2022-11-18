/* eslint-disable no-undef */
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';

describe('<GET /account>', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const spy = jest.spyOn(jwt, 'verify');
  spy.mockReturnValue({
    userId: '52',
    document: '42780908890',
    name: 'Vitor',
  } as any);

  describe('When invalid fields', () => {
    it('Should return error 401 with a details message when missing token', async () => {
      const response = await request(app).get('/account');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'token not found' });
    });

    it('Should return error 401 with a details message when passing invalid token', async () => {
      const response = await request(app)
        .get('/account')
        .set({ authorization: 'nemEtoken' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Token must be a valid token' });
    });

    describe('When valid fields', () => {
      it('Should return a 200 status with a JWT token when the information is valid', async () => {
        const login = await request(app).post('/login').send({
          username: 'Admin',
          password: 'secret_admin',
        });
        const { token } = login.body;

        const response = await request(app).get('/account').set({ authorization: token });

        expect(response.status).toBe(200);
        // expect(response.body).toEqual({
        //   id: 1,
        //   balance: '100.00',
        // });
      });
    });
  });
});
