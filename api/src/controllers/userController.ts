import { Request, Response } from 'express';
import ILoginInfo from '../interfaces/ILoginInfo';
import userService from '../services/userService';

const userController = {
  login: async (req: Request, res: Response): Promise<void> => {
    const { username, password }: ILoginInfo = req.body;
    const token = await userService.login({ username, password });
    res.status(200).json({ token });
  },
  register: async (req: Request, res: Response): Promise<void> => {
    const { username, password }: ILoginInfo = req.body;
    const token = await userService.login({ username, password });
    res.status(201).json({ token });
  },
};

export default userController;
