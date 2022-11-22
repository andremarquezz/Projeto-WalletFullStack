import { Router } from 'express';
import transactionController from '../controllers/transactionController';
import validateToken from '../middlewares/validateToken';

const router = Router();

router.get('/transaction', validateToken, transactionController.getTransactionsAll);
router.get(
  '/transaction/cashin',
  validateToken,
  transactionController.getTransactionsCashIn,
);
router.get(
  '/transaction/cashout',
  validateToken,
  transactionController.getTransactionsCashOut,
);
router.post('/transaction', validateToken, transactionController.createTransaction);
router.get('/transaction/:id', validateToken, transactionController.getTransactionOne);

export default router;
