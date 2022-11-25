import { NextFunction, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import ErrorUnauthorized from '../errors/ErrorUnauthorized';
import IResponseToken from '../interfaces/IResponseToken';
import IUserId from '../interfaces/IUserId';
import 'dotenv/config'

const { JWT_SECRET } = process.env;

const validateToken = async (
  req: Request,
  res: IResponseToken,
  next: NextFunction,
): Promise<void> => {
  const { authorization: token } = req.headers;
  if (!token) throw new ErrorUnauthorized('token not found');

  try {
    const { userId } = jwt.verify(token, JWT_SECRET as string) as IUserId;
    res.locals.user = { userId };
    next();
  } catch (error) {
    throw new ErrorUnauthorized('Token must be a valid token');
  }
};

export default validateToken;
