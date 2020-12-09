import express from 'express';
import {getTutors, getTutorsInRadius, getTutor, registerSubject, unRegisterSubject} from '../controllers/tutor.js';
import User from '../models/User.js';

const router = express.Router({mergeParams: true});

// Include other routes
import reviewRouter from './review.js';

import advancedResults from '../middleware/advancedResults.js';

import {protect, authorize} from '../middleware/auth.js';

// Reroute into other resource routers
router.use('/:tutorId/reviews', reviewRouter);

router
    .route('/')
    .get(advancedResults(User, {
        path: 'subjects',
        select: 'title',
        populate: {
            path: "category",
            select: "name"
        }
    }), getTutors)
    .post(protect, authorize('tutor'), registerSubject)
    .put(protect, authorize('tutor'), unRegisterSubject);

router
    .route('/:id')
    .get(getTutor);

router
    .route('/radius/:zipcode/:distance')
    .get(getTutorsInRadius);

export default router;