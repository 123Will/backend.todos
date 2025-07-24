import { Router } from 'express';
import { estimateRide } from '../controllers/rideController';

const router = Router();

router.post('/estimate', estimateRide);
router.patch('/confirm', require('../controllers/rideController').confirmRide);
router.get('/:customer_id', require('../controllers/rideController').getRides);

export default router; 