import { Request } from 'express';
import IResponseToken from '../interfaces/IResponseToken';
import transactionService from '../services/transactionService';

const transactionController = {
  getTransactionsAll: async (_req: Request, res: IResponseToken) => {
    const { user } = res.locals;
    const transactions = await transactionService.getTransactions(user);
    res.status(200).json(transactions);
  },

  getTransactionsCashIn: async (_req: Request, res: IResponseToken) => {
    const { user } = res.locals;
    const transactions = await transactionService.getTransactionsCashIn(user);
    res.status(200).json(transactions);
  },

  getTransactionsCashOut: async (_req: Request, res: IResponseToken) => {
    const { user } = res.locals;
    const transactions = await transactionService.getTransactionsCashOut(user);
    res.status(200).json(transactions);
  },

  createTransaction: async (req: Request, res: IResponseToken): Promise<void> => {
    const { userCashIn, value } = req.body;
    const { user } = res.locals;
    const transaction = await transactionService.createTransaction({
      userCashIn,
      user,
      value,
    });
    res.status(200).json(transaction);
  },
};

export default transactionController;
