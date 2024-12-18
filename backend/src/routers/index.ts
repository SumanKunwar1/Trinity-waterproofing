import { Router } from 'express';
import userRoutes from './userRoutes'; 
import categoryRoutes from './categoryRoutes'; 

const router = Router();

router.use('/users', userRoutes); 
router.use('/category', categoryRoutes); 


export default router;
