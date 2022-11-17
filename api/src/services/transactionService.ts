import IInfoUser from '../interfaces/IInfoUser';
import AccountModel from '../database/models/AccountModel';
import UserModel from '../database/models/UserModel';
import TransactionModel from '../database/models/TransactionModel';
import IInfoTransaction from '../interfaces/IInfoTransaction';
import sequelize from '../database/models';
import ErrorUnauthorized from '../errors/ErrorUnauthorized';
import ErrorBadRequest from '../errors/ErrorBadRequest';
import ErrorConflict from '../errors/ErrorConflict';
import ErrorInternalServer from '../errors/ErrorInternalServer';
import IResponseAccount from '../interfaces/IResponseAccount';
import accountService from './accountService';
import { Op } from 'sequelize';
import IResponseTransaction from '../interfaces/IResponseTransaction';

const transactionService = {
  getTransactions: async ({
    accountId,
  }: IInfoUser): Promise<IResponseTransaction[] | null> => {
    const transactions = await TransactionModel.findAll({
      where: {
        [Op.or]: [{ debitedAccountId: accountId }, { creditedAccountId: accountId }],
      },
    });
    return transactions;
  },

  getTransactionsCashIn: async ({
    accountId,
  }: IInfoUser): Promise<IResponseTransaction[] | null> => {
    const transactions = await TransactionModel.findAll({
      where: { creditedAccountId: accountId },
    });
    return transactions;
  },

  getTransactionsCashOut: async ({
    accountId,
  }: IInfoUser): Promise<IResponseTransaction[] | null> => {
    const transactions = await TransactionModel.findAll({
      where: { debitedAccountId: accountId },
    });
    return transactions;
  },

  handleCashOut: async ({
    userCashIn,
    user: userCashOut,
    value,
  }: IInfoTransaction): Promise<IResponseAccount | null> => {
    const userToReceive = await UserModel.findOne({
      where: {
        username: userCashIn,
      },
    });

    if (!userToReceive) throw new ErrorBadRequest('User does not exist');

    if (userToReceive.accountId === userCashOut.accountId) {
      throw new ErrorConflict('It is not possible to transfer to the same account');
    }

    const accountCashOut = await accountService.getBalance(userCashOut);

    if (Number(accountCashOut?.balance) < value) {
      throw new ErrorUnauthorized('Balance insufficient');
    }

    return accountCashOut;
  },
  handleCashIn: async (userCashIn: string) => {
    const user = await UserModel.findOne({
      where: { username: userCashIn },
      attributes: ['accountId'],
    });

    return AccountModel.findByPk(user?.accountId);
  },
  createTransaction: async (infoTransaction: IInfoTransaction) => {
    const accountCashOut = await transactionService.handleCashOut(infoTransaction);
    const accountCashIn = await transactionService.handleCashIn(
      infoTransaction.userCashIn
    );

    try {
      const transaction = await sequelize.transaction(async (t) => {
        await accountCashOut?.decrement(
          {
            balance: infoTransaction.value,
          },
          {
            transaction: t,
          }
        );
        await accountCashIn?.increment(
          {
            balance: infoTransaction.value,
          },
          { transaction: t }
        );
        return TransactionModel.create(
          {
            debitedAccountId: accountCashOut?.id,
            creditedAccountId: accountCashIn?.id,
            value: infoTransaction.value,
          },
          { transaction: t }
        );
      });

      return transaction;
    } catch (error) {
      throw new ErrorInternalServer('Error when performing transaction');
    }
  },
};

export default transactionService;
