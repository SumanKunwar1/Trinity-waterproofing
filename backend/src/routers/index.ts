import { Router } from 'express';
import userRoutes from './userRoutes';  // Import your route file

const router = Router();

// Register your routes
router.use('/users', userRoutes); 

export default router;
