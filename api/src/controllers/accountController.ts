import { Request, Response } from 'express';
import IResponseToken from '../interfaces/IResponseToken';
import accountService from '../services/accountService';

const accountController = {
  getBalance: async (_req: Request, res: IResponseToken): Promise<void> => {
    const { user } = res.locals;
    const balance = await accountService.getBalance(user);
    res.status(200).json(balance);
  },
  transaction: async (req: Request, res: IResponseToken): Promise<void> => {
    const { userCashIn, value } = req.body;
    const { user } = res.locals;
    const transaction = await accountService.transaction({ userCashIn, user, value });
    res.status(200).json(transaction);
  },
};

export default accountController;
