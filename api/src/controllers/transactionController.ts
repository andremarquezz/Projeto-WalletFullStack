import { Request } from 'express';
import IResponseToken from '../interfaces/IResponseToken';
import transactionService from '../services/transactionService';

const transactionController = {
  getTransactionsAll: async (_req: Request, res: IResponseToken): Promise<void> => {
    const { user } = res.locals;
    const transactions = await transactionService.getTransactionsAll(user);
    res.status(200).json(transactions);
  },

  getTransaction: async (req: Request, res: IResponseToken): Promise<void> => {
    const { id } = req.params
    const transaction = await transactionService.getTransaction(id);
    res.status(200).json(transaction);
  },

  getTransactionsCashIn: async (_req: Request, res: IResponseToken): Promise<void> => {
    const { user } = res.locals;
    const transactions = await transactionService.getTransactionsCashIn(user);
    res.status(200).json(transactions);
  },

  getTransactionsCashOut: async (_req: Request, res: IResponseToken): Promise<void> => {
    const { user } = res.locals;
    const transactions = await transactionService.getTransactionsCashOut(user);
    res.status(200).json(transactions);
  },

  createTransaction: async (req: Request, res: IResponseToken): Promise<void> => {
    const { userCashIn, value } = req.body;
    const { user } = res.locals;
    const transaction = await transactionService.handleTransaction({
      userCashIn,
      user,
      value,
    });
    res.status(200).json(transaction);
  },
};

export default transactionController;
