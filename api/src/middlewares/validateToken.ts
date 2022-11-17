import { NextFunction, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import ErrorUnauthorized from '../errors/ErrorUnauthorized';
import UserModel from '../database/models/UserModel';
import IResponseToken from '../interfaces/IResponseToken';
import IInfoToken from '../interfaces/IInfoToken';

const { JWT_SECRET } = process.env;

const validateToken = async (req: Request, res: IResponseToken, next: NextFunction) => {
  const { authorization: token } = req.headers;
  if (!token) throw new ErrorUnauthorized('token not found');

  try {
    const { accountId, userId } = jwt.verify(token, JWT_SECRET as string) as IInfoToken;
    const user = await UserModel.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new ErrorUnauthorized('User not found');
    }
    res.locals.user = { accountId, userId };
    next();
  } catch (error) {
    throw new ErrorUnauthorized('Token must be a valid token');
  }
};

export default validateToken;
