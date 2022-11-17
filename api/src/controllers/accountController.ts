import { Request } from 'express';
import IResponseToken from '../interfaces/IResponseToken';
import accountService from '../services/accountService';

const accountController = {
  getBalance: async (_req: Request, res: IResponseToken): Promise<void> => {
    const { user } = res.locals;
    const balance = await accountService.getBalance(user);
    res.status(200).json(balance);
  },
};

export default accountController;
