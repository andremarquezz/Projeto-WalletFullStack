import { NextFunction, Request, Response } from 'express';
import IError from '../interfaces/IError';

const errorMiddleware = (
  err: IError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(err.code || 500).json({ error: err.message });
};

export default errorMiddleware;
