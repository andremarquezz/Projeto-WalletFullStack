import { NextFunction, Request } from 'express';
import UserModel from '../database/models/UserModel';
import ErrorBadRequest from '../errors/ErrorBadRequest';
import ErrorConflict from '../errors/ErrorConflict';
import IInfoUser from '../interfaces/IInfoUser';
import IResponseToken from '../interfaces/IResponseToken';

const MIN_CHARACTER_USER = 3;
const MIN_CHARACTER_PASS = 8;

const validateInfoRegister = async (
  req: Request,
  _res: IResponseToken,
  next: NextFunction,
): Promise<void> => {
  const { username, password }: IInfoUser = req.body;

  if (!username || !password) {
    throw new ErrorBadRequest('username and password is required');
  }

  if (username.length < MIN_CHARACTER_USER) {
    throw new ErrorBadRequest('username must be at least 3 characters');
  }
  if (password.length < MIN_CHARACTER_PASS) {
    throw new ErrorBadRequest('password must be at least 8 characters');
  }
  const userExists = await UserModel.findOne({
    where: {
      username,
    },
  });
  if (userExists) throw new ErrorConflict('username already exists');

  const regex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/gm;

  const passwordValid = regex.test(password);

  if (!passwordValid) {
    throw new ErrorBadRequest(
      'The password must have at least one uppercase, lowercase letter and number',
    );
  }

  next();
};

export default validateInfoRegister;
