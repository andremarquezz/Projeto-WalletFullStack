import { Router } from 'express';
import transactionController from '../controllers/transactionController';
import validateToken from '../middlewares/validateToken';

const router = Router();

router.get('/transaction', validateToken, transactionController.getTransactions);
router.post('/transaction', validateToken, transactionController.createTransaction);

export default router;
