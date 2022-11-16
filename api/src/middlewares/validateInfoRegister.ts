import { NextFunction, Request } from 'express';
import UserModel from '../database/models/UserModel';
import ErrorBadRequest from '../errors/ErrorBadRequest';
import ILoginInfo from '../interfaces/ILoginInfo';
import IResponseToken from '../interfaces/IResponseToken';

const MIN_CHARACTER_USER = 3;
const MIN_CHARACTER_PASS = 8;

const validateInfoRegister = async (
  req: Request,
  _res: IResponseToken,
  next: NextFunction
) => {
  const { username, password }: ILoginInfo = req.body
  
  if (username.length < MIN_CHARACTER_USER)
    throw new ErrorBadRequest('username must be at least 3 characters');
  if (password.length < MIN_CHARACTER_PASS)
    throw new ErrorBadRequest('password must be at least 8 characters');
  const userExists = await UserModel.findOne({
    where: {
      username,
    },
  });
  if (userExists) throw new ErrorBadRequest('username already exists');

  // verificar senha com regex

  next()
};

export default validateInfoRegister;
