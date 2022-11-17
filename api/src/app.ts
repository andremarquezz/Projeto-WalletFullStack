import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import IError from './interfaces/IError';
import userRoutes from './routes/userRoutes';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';


const app = express();

app.use('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ message: 'message' });
});

app.use(express.json());
app.use(userRoutes);
app.use(accountRoutes);
app.use(transactionRoutes);

app.use((err: IError, _req: Request, res: Response, _next: NextFunction) =>
  res.status(err.code || 500).json({ error: err.message })
);

export default app;
