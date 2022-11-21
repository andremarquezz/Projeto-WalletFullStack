import IUser from '../interfaces/IUser';
import api from './index';

export const authenticationUser = async (user: IUser): Promise<string> => {
  const response = await api.post('/login', user);
  console.log(response);
  
  return response.data;
};
