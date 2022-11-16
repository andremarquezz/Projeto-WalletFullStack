import { Router } from 'express'
import userController from "../controllers/userController";
import validateInfoRegister from '../middlewares/validateInfoRegister';

const router = Router();

router.post('/login', userController.login);
router.post('/register', validateInfoRegister, userController.register);

export default router
