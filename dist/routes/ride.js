"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rideController_1 = require("../controllers/rideController");
const router = (0, express_1.Router)();
router.post('/estimate', rideController_1.estimateRide);
router.patch('/confirm', require('../controllers/rideController').confirmRide);
router.get('/:customer_id', require('../controllers/rideController').getRides);
exports.default = router;
