import {uploadImage} from 'cloudinary-simple-upload';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

import Category from '../models/Category.js';

/**
 * @desc    Get all categories
 * @route   GET /api/v1/categories
 * @access  Public
 * */
export const getCategories = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single category
 * @route   GET /api/v1/categories/:id
 * @access  Public
 * */
export const getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
       return next(
            new ErrorResponse(`Category not found with the id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({success: true, data: category});
});

// @desc      Create new category
// @route     POST /api/v1/categories
// @access    Private
export const createCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.create(req.body);

    res.status(201).json({
        success: true,
        data: category
    });
});

// @desc      Add category photo
// @route     PUT /api/v1/categories/:id/photo
// @access    Private
export const addPhoto = asyncHandler(async (req, res, next) => {
   let category = await Category.findById(req.params.id);

   if (!category) {
       return next(
           new ErrorResponse(`Category with ID ${req.params.id} not found`, 404)
       );
   }

   if (!req.files) {
        return next(
          new ErrorResponse('Please upload an image', 400)
        );
   }

   const image = await uploadImage(req.files.image, 'Tutorials category', 'owner');

   category = await Category.findByIdAndUpdate(req.params.id, {photo: image}, {
       new: true
   });

   res.status(200).json({
       success: true,
       data: category
   });
});

// @desc      Update category
// @route     PUT /api/v1/categories/:id
// @access    Private
export const updateCategory = asyncHandler(async (req, res, next) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
        return next(
            new ErrorResponse(`Category with ID ${req.params.id} not found`, 404)
        );
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: category
    })
});

// @desc      Delete category
// @route     DELETE/ /api/v1/categories/:id
// @access    Private
export const deleteCategry = asyncHandler( async (req, res, next) => {
   const category = await Category.findById(req.params.id);

    if (!category) {
        return next(
            new ErrorResponse(`Category with ID ${req.params.id} not found`, 404)
        );
    }

    await category.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});