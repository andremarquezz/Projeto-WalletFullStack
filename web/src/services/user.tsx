import IUser from '../interfaces/IUser';
import IUsername from '../interfaces/IUsername';
import api from './index';

export const authenticationUser = async (user: IUser): Promise<string> => {
  const response = await api.post('/login', user);
  return response.data;
};

export const registerUser = async (user: IUser): Promise<string> => {
  const response = await api.post('/register', user);
  return response.data;
};

export const findUser = async (user: number): Promise<IUsername> => {
  const userStorage = JSON.parse(localStorage.getItem('user') || '');
  api.defaults.headers.authorization = userStorage.token;

  const response = await api.get(`/user/${user}`);

  return response.data;
};
