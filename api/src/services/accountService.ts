import IInfoUser from '../interfaces/IInfoUser';
import AccountModel from '../database/models/AccountModel';
import IResponseAccount from '../interfaces/IResponseAccount';

const accountService = {
  getBalance: async (user: IInfoUser): Promise<IResponseAccount | null> => {
    const balance = await AccountModel.findByPk(user.userId);
    return balance;
  },
};

export default accountService;
