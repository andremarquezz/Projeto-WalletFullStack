import { Router } from 'express';
import userController from '../controllers/userController';
import validateInfoRegister from '../middlewares/validateInfoRegister';
import validateToken from '../middlewares/validateToken';

const router = Router();

router.post('/login', userController.login);
router.post('/register', validateInfoRegister, userController.register);
router.get('/user/:id', validateToken, userController.findUser);

export default router;
