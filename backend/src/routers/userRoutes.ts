import { Router } from 'express';
import { UserController } from '../controllers';
import { handleResponse, validateUser } from '../middlewares';

const router = Router();
const userController = new UserController();

router.post('/', validateUser, userController.createUser.bind(userController), handleResponse);
router.post('/login', userController.loginUser.bind(userController), handleResponse);


export default router;
