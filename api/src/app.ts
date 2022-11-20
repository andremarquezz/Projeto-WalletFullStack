import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';
import swaggerDocs from './swagger.json';
import errorMiddleware from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(userRoutes);
app.use(accountRoutes);
app.use(transactionRoutes);
app.use(errorMiddleware);

export default app;
