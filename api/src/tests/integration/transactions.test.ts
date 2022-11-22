import request from 'supertest';
import app from '../../app';
import TransactionModel from '../../database/models/TransactionModel';
import { createdTransaction, transaction } from './mocks/mockTransaction';
import IResponseTransaction from '../../interfaces/IResponseTransaction';

const createToken = async () => {
  const response = await request(app).post('/login').send({
    username: 'Admin',
    password: 'secret_admin',
  });

  return response.body.token;
};

describe('< GET /transaction>', () => {
  describe('When invalid fields', () => {
    it('Should return error 401 with a details message when missing token', async () => {
      const response = await request(app).get('/transaction');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'token not found' });
    });
  });
  describe('When valid fields', () => {
    let token: any;

    beforeAll(async () => {
      token = await createToken();
    });

    it('Should return status 200 and an array containing transaction information', async () => {
      const spyTransaction = jest.spyOn(TransactionModel, 'findAll');
      spyTransaction.mockReturnValue(transaction);
      const response = await request(app)
        .get('/transaction')
        .set({ authorization: token });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining(transaction));
    });
  });
});

describe('< POST /transaction>', () => {
  let token: any;

  beforeAll(async () => {
    token = await createToken();
  });

  describe('When invalid fields', () => {
    it('Should return error 401 with a details message when missing token', async () => {
      const response = await request(app).post('/transaction').send({
        userCashIn: 'User',
        value: 5,
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'token not found' });
    });
    it('Should return error 400 with a message of details when not finding userCashIn', async () => {
      const response = await request(app)
        .post('/transaction')
        .send({
          userCashIn: 'John Doe',
          value: 5,
        })
        .set({ authorization: token });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'User does not exist' });
    });
    it("Should return error 401 with a detail message when you don't have enough balance", async () => {
      const response = await request(app)
        .post('/transaction')
        .send({
          userCashIn: 'User',
          value: 99999,
        })
        .set({ authorization: token });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Balance insufficient' });
    });
    it('Should return 409 error with detail message when user cashIn is same as cashOut', async () => {
      const response = await request(app)
        .post('/transaction')
        .send({
          userCashIn: 'Admin',
          value: 5,
        })
        .set({ authorization: token });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        error: 'It is not possible to transfer to the same account',
      });
    });
  });
  describe('When valid fields', () => {
    let token: any;

    beforeAll(async () => {
      token = await createToken();
    });

    it('Should return status 200 and an object containing valid information', async () => {
      const response = await request(app)
        .post('/transaction')
        .send({
          userCashIn: 'User',
          value: 5,
        })
        .set({ authorization: token });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          ...createdTransaction,
          createdAt: response.body.createdAt,
          id: response.body.id,
        })
      );
    });
  });
});

describe('<GET /transaction/cashout>', () => {
  let token: any;

  beforeAll(async () => {
    token = await createToken();
  });

  describe('When invalid fields', () => {
    it('Should return error 401 with a details message when missing token', async () => {
      const response = await request(app).get('/transaction/cashout');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'token not found' });
    });
  });
  describe('When valid fields', () => {
    const spyTransaction = jest.spyOn(TransactionModel, 'findAll');
    spyTransaction.mockReturnValue(transaction);

    it('Should return status 200 and an array containing the userid in the debitedAccountId key', async () => {
      const response = await request(app)
        .get('/transaction/cashout')
        .set({ authorization: token });

      expect(response.status).toBe(200);

      response.body.map((transaction: IResponseTransaction) => {
        expect(transaction.debitedAccountId).toEqual(1);
      });
    });
  });
});

describe('<GET /transaction/cashin>', () => {
  let token: any;

  beforeAll(async () => {
    token = await createToken();
  });

  describe('When invalid fields', () => {
    it('Should return error 401 with a details message when missing token', async () => {
      const response = await request(app).get('/transaction/cashin');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'token not found' });
    });
  });
  describe('When valid fields', () => {
    const spyTransaction = jest.spyOn(TransactionModel, 'findAll');
    spyTransaction.mockReturnValue(transaction);

    it('Should return status 200 and an array containing the userid 2 in the creditedAccountId key', async () => {
      const response = await request(app)
        .get('/transaction/cashin')
        .set({ authorization: token });

      expect(response.status).toBe(200);

      response.body.map((transaction: IResponseTransaction) => {
        expect(transaction.creditedAccountId).toEqual(2);
      });
    });
  });
});
