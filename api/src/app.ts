import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import IError from './interfaces/IError';
import userRoutes from './routes/userRoutes';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';
// eslint-disable-next-line import/extensions
import swaggerDocs from './swagger.json';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(userRoutes);
app.use(accountRoutes);
app.use(transactionRoutes);

app.use((err: IError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.code || 500).json({ error: err.message });
});

export default app;
