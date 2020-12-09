import express from 'express';
import {
    createBooking,
    deleteBooking,
    getBooking,
    getBookings,
    updateBookingStatus,
    updateBookingToPaid
} from '../controllers/booking.js';

const router = express.Router({mergeParams: true});

import {protect, authorize} from '../middleware/auth.js';

import advancedResults from "../middleware/advancedResults.js";

import Booking from "../models/Booking.js";

router
    .route('/')
    .get(protect, authorize('admin'), advancedResults(Booking, {
        path: 'tutor user subject',
        select: 'name email title'
    }), getBookings)
    .post(protect, authorize('admin', 'user'), createBooking);

router
    .route('/:id')
    .get(protect, getBooking)
    .delete(protect, authorize('admin'), deleteBooking);

router.route('/:id/pay').put(protect, authorize('admin'), updateBookingToPaid);
router.route('/:id/status').put(protect, updateBookingStatus);



export default router;

