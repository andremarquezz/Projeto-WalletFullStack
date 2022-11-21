import IUser from '../interfaces/IUser';
import api from './index';

export const authenticationUser = async (user: IUser): Promise<string> => {
  const response = await api.post('/login', user);
  return response.data;
};

export const registerUser = async (user: IUser): Promise<string> => {
  const response = await api.post('/register', user);
  return response.data;
};
