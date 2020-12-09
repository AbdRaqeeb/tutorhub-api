import Subject from '../models/Subject.js';
import Category from '../models/Category.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

/**
 * @desc    Get subjects
 * @route   GET /api/v1/subjects
 * @route   GET /api/v1/categories/:categoryId/subjects
 * @access  Public
 * */
export const getSubjects = asyncHandler(async (req, res, next) => {
    if (req.params.categoryId) {
        const subjects = await Subject.find({
            category: req.params.categoryId
        });

        return res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

/**
 * @desc    Get single subject
 * @route   GET /api/v1/subjects/:id
 * @access  Public
 * */
export const getSubject = asyncHandler(async (req, res, next) => {
    const subject = await Subject.findById(req.params.id).populate({
        path: 'category',
        select: 'name description'
    });

    if (!subject) {
        return next(
            new ErrorResponse(`Subject with the ID ${req.params.id} not found`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: subject
    });
});

/**
 * @desc    Add subject
 * @route   POST /api/v1/categories/:categoryId/subjects
 * @access  Private
 * */
export const addSubject = asyncHandler(async (req, res, next) => {
    req.body.category = req.params.categoryId;

    const category = await Category.findById(req.params.categoryId);
    if (!category) {
        return next(
            new ErrorResponse(`Category with the ID ${req.params.id} not found`, 404)
        );
    }

    let subject = await Subject.findOne({title: req.body.title, category: req.params.categoryId});

    if (subject) {
        return next(
            new ErrorResponse(`Subject with the title ${req.body.title} already exists`, 404)
        );
    }

    subject = await Subject.create(req.body);

    res.status(201).json({
       success: true,
       data: subject
    });
});


/**
 * @desc    Update subject
 * @route   PUT /api/v1/subjects/:id
 * @access  Private
 * */
export const updateSubject = asyncHandler(async (req, res, next) => {
    let subject = await Subject.findById(req.params.id);

    if (!subject) {
        return next(
            new ErrorResponse(`Subject with the ID ${req.params.id} not found`, 404)
        );
    }

    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    subject.save();

    res.status(200).json({
        success: true,
        data: subject
    });
});

/**
 * @desc    Update subject
 * @route   DELETE /api/v1/subjects/:id
 * @access  Private
 * */
export const deleteSubject = asyncHandler(async (req, res, next) => {
    let subject = await Subject.findById(req.params.id);

    if (!subject) {
        return next(
            new ErrorResponse(`Subject with the ID ${req.params.id} not found`, 404)
        );
    }

    await subject.remove();

    res.status(200).json({
       success: true,
       data: {}
    });
});