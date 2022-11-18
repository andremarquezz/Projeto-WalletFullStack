import IUserId from '../interfaces/IUserId';
import AccountModel from '../database/models/AccountModel';
import IResponseAccount from '../interfaces/IResponseAccount';

const accountService = {
  getBalance: async (user: IUserId): Promise<IResponseAccount | null> => {
    const balance = await AccountModel.findByPk(user.userId);
    return balance;
  },
};

export default accountService;
