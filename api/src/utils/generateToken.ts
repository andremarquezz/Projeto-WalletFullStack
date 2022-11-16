import * as jwt from 'jsonwebtoken';
import 'express-async-errors';
import IInfoToken from '../interfaces/IInfoToken';

const jwtConfig: jwt.SignOptions = {
  expiresIn: '24h',
  algorithm: 'HS256',
};

const { JWT_SECRET } = process.env;

const generateToken = async ({ username, userId }: IInfoToken): Promise<string> => {
  return jwt.sign({ username, userId }, JWT_SECRET as string, jwtConfig);
};

export default generateToken;
