import IBalance from '../interfaces/IBalance';
import IInfoTransaction from '../interfaces/IInfoTransaction';
import ITransaction from '../interfaces/ITransaction';
import api from './index';

export const getBalance = async (): Promise<IBalance> => {
  const userStorage = JSON.parse(localStorage.getItem('user') || '');
  api.defaults.headers.authorization = userStorage.token;

  const response = await api.get('/account');
  return response.data;
};

export const createTransaction = async (
  infoTransaction: IInfoTransaction
): Promise<ITransaction> => {
  const userStorage = JSON.parse(localStorage.getItem('user') || '');
  api.defaults.headers.authorization = userStorage.token;

  const response = await api.post('/transaction', infoTransaction);
  return response.data;
};

export const getAllTransactions = async (): Promise<ITransaction[]> => {
  const userStorage = JSON.parse(localStorage.getItem('user') || '');
  api.defaults.headers.authorization = userStorage.token;

  const response = await api.get('/transaction');
  return response.data;
};

export const getOneTransaction = async (
  id: string | undefined
): Promise<ITransaction> => {
  const userStorage = JSON.parse(localStorage.getItem('user') || '');
  api.defaults.headers.authorization = userStorage.token;

  const response = await api.get(`/transaction/${id}`);
  return response.data;
};

export const getTransactionsCashIn = async (): Promise<ITransaction[]> => {
  const userStorage = JSON.parse(localStorage.getItem('user') || '');
  api.defaults.headers.authorization = userStorage.token;

  const response = await api.get('/transaction/cashin');
  
  return response.data;
};

export const getTransactionsCashOut = async (): Promise<ITransaction[]> => {
  const userStorage = JSON.parse(localStorage.getItem('user') || '');
  api.defaults.headers.authorization = userStorage.token;

  const response = await api.get('/transaction/cashout');
  return response.data;
};
