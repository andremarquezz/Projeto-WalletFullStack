import { Op, Transaction } from 'sequelize';
import IUserId from '../interfaces/IUserId';
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
import IResponseTransaction from '../interfaces/IResponseTransaction';
import ITransaction from '../interfaces/ITransaction';

const transactionService = {
  getTransactions: async ({
    userId,
  }: IUserId): Promise<IResponseTransaction[] | null> => {
    const transactions = await TransactionModel.findAll({
      where: {
        [Op.or]: [{ debitedAccountId: userId }, { creditedAccountId: userId }],
      },
    });
    return transactions;
  },

  getTransactionsCashIn: async ({
    userId,
  }: IUserId): Promise<IResponseTransaction[] | null> => {
    const transactions = await TransactionModel.findAll({
      where: { creditedAccountId: userId },
    });
    return transactions;
  },

  getTransactionsCashOut: async ({
    userId,
  }: IUserId): Promise<IResponseTransaction[] | null> => {
    const transactions = await TransactionModel.findAll({
      where: { debitedAccountId: userId },
    });
    return transactions;
  },

  handleAccountCashOut: async ({
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

    if (userToReceive.id === userCashOut.userId) {
      throw new ErrorConflict('It is not possible to transfer to the same account');
    }

    const accountCashOut = await accountService.getBalance(userCashOut);

    if (Number(accountCashOut?.balance) < value) {
      throw new ErrorUnauthorized('Balance insufficient');
    }

    return accountCashOut;
  },
  handleAccountCashIn: async (userCashIn: string): Promise<IResponseAccount | null> => {
    const user = await UserModel.findOne({
      where: { username: userCashIn },
      attributes: ['accountId'],
    });

    return AccountModel.findByPk(user?.accountId);
  },

  handleDebited: async ({
    infoTransaction,
    t,
  }: ITransaction): Promise<IResponseAccount | null> => {
    const accountCashOut = await transactionService.handleAccountCashOut(infoTransaction);
    await accountCashOut?.decrement(
      {
        balance: infoTransaction.value,
      },
      {
        transaction: t,
      },
    );
    return accountCashOut;
  },

  handleCredited: async ({
    infoTransaction,
    t,
  }: ITransaction): Promise<IResponseAccount | null> => {
    const accountCashIn = await transactionService.handleAccountCashIn(
      infoTransaction.userCashIn,
    );
    await accountCashIn?.increment(
      {
        balance: infoTransaction.value,
      },
      { transaction: t },
    );
    return accountCashIn;
  },

  createTransaction: async (infoTransaction: IInfoTransaction) => {
    try {
      const transaction = await sequelize.transaction(async (t: Transaction) => {
        const accountCashOut = await transactionService.handleDebited({ infoTransaction, t });
        const accountCashIn = await transactionService.handleCredited({ infoTransaction, t });
        TransactionModel.create(
          {
            debitedAccountId: accountCashOut?.id,
            creditedAccountId: accountCashIn?.id,
            value: infoTransaction.value,
          },
          { transaction: t },
        );
      });
      return transaction;
    } catch (error) {
      throw new ErrorInternalServer('Error when performing transaction');
    }
  },
};

export default transactionService;
