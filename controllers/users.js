import asyncHandler from '../middleware/async.js';
import User from '../models/User.js';

/**
 * @desc    Get users
 * @route   GET /api/v1/users
 * @access  private/admin
 * */
export const getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single user
 * @route   GET /api/v1/users/:id
 * @access  private/admin
 * */
export const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate({
        path: "subjects",
        select: "title"
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Add  user
 * @route   GET /api/v1/users
 * @access  private/admin
 * */
export const createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Update  user
 * @route   PUT /api/v1/users/:id
 * @access  private/admin
 * */
export const updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.address) user.address = req.body.address;

    await user.save();
    res.status(200).json({
        success: true,
        data: user,
    });
});

/**
 * @desc    Delete  user
 * @route   DELETE /api/v1/users/:id
 * @access  private/admin
 * */
export const deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});
