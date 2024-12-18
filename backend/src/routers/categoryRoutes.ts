import { Router } from 'express';
import { CategoryController } from '../controllers';
import { validateCategory, handleResponse, isAuthenticated, isAuthorized , handleError} from '../middlewares';

const router = Router();
const categoryController = new CategoryController();

router.post('/',isAuthenticated, isAuthorized('admin') , validateCategory, categoryController.createCategory.bind(categoryController), handleResponse);
router.use(handleError);

export default router;
