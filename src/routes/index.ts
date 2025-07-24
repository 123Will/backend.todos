import { Router } from 'express';
import rideRoutes from './ride';

const router = Router();

router.use('/ride', rideRoutes);

export default router; 