import express from 'express';
import Subject from '../models/Subject.js';
import {addSubject, deleteSubject, getSubject, getSubjects, updateSubject} from '../controllers/subject.js';

const router = express.Router({mergeParams: true});

import advancedResults from '../middleware/advancedResults.js';

import {protect, authorize} from '../middleware/auth.js';

import tutorsRouter from './tutor.js';
import bookingRouter from './booking.js';

router.use('/:subjectId/tutors', tutorsRouter);
router.use('/:subjectId/bookings', bookingRouter);

router
    .route('/')
    .get(advancedResults(Subject, {
        path: 'category',
        select: 'name description'
    }), getSubjects)
    .post(protect, authorize('admin'), addSubject);

router
    .route('/:id')
    .get(getSubject)
    .put(protect, authorize('admin'), updateSubject)
    .delete(protect, authorize('admin'), deleteSubject);

export default router;