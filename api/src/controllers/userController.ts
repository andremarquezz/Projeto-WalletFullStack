import { Request, Response } from 'express';
import IInfoUser from '../interfaces/IInfoUser';
import userService from '../services/userService';

const userController = {
  login: async (req: Request, res: Response): Promise<void> => {
    const { username, password }: IInfoUser = req.body;
    const token = await userService.login({ username, password });
    res.status(200).json({ token });
  },
  register: async (req: Request, res: Response): Promise<void> => {
    const { username, password }: IInfoUser = req.body;
    const token = await userService.register({ username, password });
    res.status(201).json({ token });
  },
  findUser: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await userService.findUser(id);
    res.status(200).json({ user });
  },
};

export default userController;
