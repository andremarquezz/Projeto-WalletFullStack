import { Router } from 'express';
import accountController from '../controllers/accountController';
import validateToken from '../middlewares/validateToken';

const router = Router();

router.get('/account', validateToken, accountController.getBalance)
router.post('/transaction', validateToken, accountController.transaction);



export default router;
