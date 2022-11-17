import IInfoUser from '../interfaces/IInfoUser';
import AccountModel from '../database/models/AccountModel';
import UserModel from '../database/models/UserModel';
import TransactionModel from '../database/models/TransactionModel';
import ITransaction from '../interfaces/ITransaction';
import sequelize from '../database/models';
import ErrorUnauthorized from '../errors/ErrorUnauthorized';
import ErrorBadRequest from '../errors/ErrorBadRequest';
import ErrorConflict from '../errors/ErrorConflict';
import ErrorInternalServer from '../errors/ErrorInternalServer';
import IResponseAccount from '../interfaces/IResponseAccount';

const accountService = {
  getBalance: async (user: IInfoUser): Promise<IResponseAccount | null> => {
    const balance = await AccountModel.findByPk(user.accountId);
    return balance;
  },

  handleCashOut: async ({
    userCashIn,
    user: userCashOut,
    value,
  }: ITransaction): Promise<IResponseAccount | null> => {
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
      throw new ErrorUnauthorized('balance insufficient');
    }

    return accountCashOut;
  },
  handleCashIn: async (userCashIn: string) => {
    const user = await UserModel.findOne({
      where: { username: userCashIn },
      attributes: ['accountId'],
    });

    const accountCashIn = await AccountModel.findByPk(user?.accountId);
    
    return accountCashIn;

  },
  transaction: async (infoTransaction: ITransaction) => {
    const accountCashOut = await accountService.handleCashOut(infoTransaction);
    const accountCashIn = await accountService.handleCashIn(infoTransaction.userCashIn);

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
            debitedAccountId: accountCashIn?.id,
            creditedAccountId: accountCashOut?.id,
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

export default accountService;
