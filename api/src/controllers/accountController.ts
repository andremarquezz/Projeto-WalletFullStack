import { Request, Response } from 'express';
import accountService from '../services/accountService';

const accountController = {
  getBalance: async (_req: Request, res: Response) => {
    const { user } = res.locals;
  },
};

export default accountController;
