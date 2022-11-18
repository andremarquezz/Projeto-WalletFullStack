import { Transaction } from 'sequelize';
import IInfoTransaction from './IInfoTransaction';

export default interface ITransaction {
  infoTransaction: IInfoTransaction;
  t: Transaction;
}
