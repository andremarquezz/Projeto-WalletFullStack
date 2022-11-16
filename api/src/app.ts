import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import IError from './interfaces/IError';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());
app.use(userRoutes);

app.use((err: IError, _req: Request, res: Response, _next: NextFunction) =>
  res.status(err.code || 500).json({ error: err.message })
);

export default app;
