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
import IResponseAccount from '../interfaces/IResponseAccount';
import accountService from './accountService';
import IResponseTransaction from '../interfaces/IResponseTransaction';
import ITransaction from '../interfaces/ITransaction';
import IError from '../interfaces/IError';
import ErrorCustom from '../errors/ErrorCustom';
import IOneTransaction from '../interfaces/IOneTransaction';

const transactionService = {
  getTransactionsAll: async ({
    userId,
  }: IUserId): Promise<IResponseTransaction[] | null> => {
    const transactions = await TransactionModel.findAll({
      where: {
        [Op.or]: [{ debitedAccountId: userId }, { creditedAccountId: userId }],
      },
    });
    return transactions;
  },
  getTransactionOne: async ({
    id,
    user,
  }: IOneTransaction): Promise<IResponseTransaction | null> => {
    const transaction = await TransactionModel.findOne({
      where: {
        [Op.and]: [
          { id },
          {
            [Op.or]: [
              { debitedAccountId: user.userId },
              { creditedAccountId: user.userId },
            ],
          },
        ],
      },
    });
    return transaction;
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

  findAccountCashIn: async (userCashIn: string): Promise<IResponseAccount | null> => {
    const user = await UserModel.findOne({
      where: { username: userCashIn },
      attributes: ['accountId'],
    });

    return AccountModel.findByPk(user?.accountId);
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
    const accountCashIn = await transactionService.findAccountCashIn(
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
  registerTransaction: async (
    transaction: ITransaction,
  ): Promise<IResponseTransaction> => {
    const accountCashOut = await transactionService.handleDebited(transaction);
    const accountCashIn = await transactionService.handleCredited(transaction);
    const { infoTransaction, t } = transaction;
    const registeredTransaction = await TransactionModel.create(
      {
        debitedAccountId: accountCashOut?.id,
        creditedAccountId: accountCashIn?.id,
        value: infoTransaction.value,
      },
      { transaction: t },
    );
    return registeredTransaction;
  },

  handleTransaction: async (
    infoTransaction: IInfoTransaction,
  ): Promise<IResponseTransaction> => {
    try {
      const transaction = await sequelize.transaction(
        async (t: Transaction): Promise<IResponseTransaction> =>
          transactionService.registerTransaction({ infoTransaction, t }),
      );
      return transaction;
    } catch (error) {
      const err = error as IError;
      throw new ErrorCustom(err.message, err.code);
    }
  },
};

export default transactionService;
