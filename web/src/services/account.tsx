import IBalance from '../interfaces/IBalance';
import IInfoTransaction from '../interfaces/IInfoTransaction';
import ITransaction from '../interfaces/ITransaction';
import api from './index';

export const getBalance = async (): Promise<IBalance> => {
  const userStorage = JSON.parse(localStorage.getItem('user') || '');

  const response = await api.get('/account', {
    headers: {
      authorization: userStorage.token,
    },
  });
  return response.data;
};

export const fetchTransaction = async (infoTransaction: IInfoTransaction): Promise<ITransaction> => {
  const userStorage = JSON.parse(localStorage.getItem('user') || '');

  const response = await api.post('/transaction', {
    headers: {
      authorization: userStorage.token,
    },
    ...infoTransaction,
  });
  return response.data;
};
