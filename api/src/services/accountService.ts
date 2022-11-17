import IInfoUser from '../interfaces/IInfoUser';
import AccountModel from '../database/models/AccountModel';

const accountService = {
  getBalance: async (user: IInfoUser) => {
    const balance = await AccountModel.findByPk(user.accountId)
    return balance
  },
};

export default accountService;
