import { Transaction } from 'sequelize';
import IInfoUser from './IInfoUser';

export default interface ICreateUser {
  userToRegister: IInfoUser;
  accountId: number;
  t: Transaction;
}
