import express from 'express';
import {
    addReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview
} from '../controllers/review.js';

const router = express.Router({mergeParams: true});
import Review from '../models/Review.js';

import advancedResults from '../middleware/advancedResults.js';
import {protect, authorize} from '../middleware/auth.js';

router
    .route('/')
    .get(advancedResults(Review, {
            path: 'tutor user',
            select: 'name description'
        }),
        getReviews
    )
    .post(protect, authorize('user', 'admin'), addReview);

router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('admin', 'user'), updateReview)
    .delete(protect, authorize('admin', 'user'), deleteReview);

export default router;