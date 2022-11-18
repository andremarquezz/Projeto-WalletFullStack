import * as jwt from 'jsonwebtoken';
import 'express-async-errors';
import IUserId from '../interfaces/IUserId';

const jwtConfig: jwt.SignOptions = {
  expiresIn: '24h',
  algorithm: 'HS256',
};

const { JWT_SECRET } = process.env;

const generateToken = async (infoUser: IUserId): Promise<string> =>
  jwt.sign(infoUser, JWT_SECRET as string, jwtConfig);

export default generateToken;
