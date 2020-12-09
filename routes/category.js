import express from 'express';
import Category from '../models/Category.js';
import {createCategory, getCategories, getCategory, addPhoto, updateCategory, deleteCategry} from '../controllers/category.js';


const router = express.Router();

// Include other routes
import subjectRouter from './subject.js';

import advancedResults from '../middleware/advancedResults.js';

//middleware
import {protect, authorize} from '../middleware/auth.js';

// Reroute into other resource routers
router.use('/:categoryId/subjects', subjectRouter);

router
    .route('/')
    .get(advancedResults(Category, 'subjects'), getCategories)
    .post(protect, authorize('admin'), createCategory);

router
    .route('/:id')
    .get(getCategory)
    .put(protect, authorize('admin'), updateCategory)
    .delete(protect, authorize('admin'), deleteCategry);

router
    .route('/:id/photo')
    .put(protect, authorize('admin'), addPhoto);

export default router;