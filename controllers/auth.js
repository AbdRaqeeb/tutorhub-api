import crypto from 'crypto';
import {uploadImage} from 'cloudinary-simple-upload';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import sendEmail from '../utils/sendEmail.js';

import User from '../models/User.js';

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 *
 */
export const register = asyncHandler(async (req, res, next) => {
    const {name, role, email, password, address, username} = req.body;

    let user = await User.findOne({username});

    if (user) {
        return next(
            new ErrorResponse(`The username ${username} is already taken`, 400)
        );
    }

    user = await User.create({
        username,
        name,
        role,
        password,
        address,
        email
    });

    // grab token and send to email
    const confirmEmailToken = user.generateEmailConfirmToken();

    //create confirm url
    const confirmEmailUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/confirm/email?token=${confirmEmailToken}`;

    const message = `You are receiving this email because you need to confirm your email address. Please make a GET request to: \n\n ${confirmEmailUrl}`;

    await user.save({validateBeforeSave: false});

    const sendResult = await sendEmail({
        email: user.email,
        subject: 'Email confirmation token',
        message
    });

    sendTokenResponse(user, 201, res);
});

/**
 * @desc    login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 * */
export const login = asyncHandler(async (req, res, next) => {
    const {username, password} = req.body;

    // Validate login
    if (!username || !password) {
        return next(
            new ErrorResponse('Please provide an email and password')
        );
    }

    // check for user
    const user = await User.findOne({username}).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);

});


/**
 * @desc    logout user / clear cookie
 * @route   POST /api/v1/auth/logout
 * @access  Private
 * */
export const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
});

/**
 * @desc    Get user
 * @route   GET /api/v1/auth/me
 * @access  Private
 * */
export const getMe = asyncHandler(async (req, res, next) => {
    // user is already available in req due to the protect middleware
    const user = req.user;

    res.status(200).json({
        success: true,
        data: user,
    });
});

/**
 * @desc    Update user details
 * @route   PUT /api/v1/auth/update
 * @access  Private
 * */
export const updateDetails = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
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
 * @desc    Upload user photos
 * @route   PUT /api/v1/auth/upload/photo
 * @access  Private
 * */
export const uploadPhoto = asyncHandler(async (req, res, next) => {
    if (!req.files) {
        return next(
            new ErrorResponse('Please upload an image', 400)
        );
    }

    const image = await uploadImage(req.files.image, 'Tutorials Users', 'owner');

    const user = await User.findByIdAndUpdate(req.user.id, {image}, {
        new: true,
        runValidators: false,
    });

    res.status(200).json({
        success: true,
        data: user,
    });
});

/**
 * @desc    Update user password
 * @route   PUT /api/v1/auth/password
 * @access  Private
 * */
export const updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

// Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 * */
export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({success: true, data: 'Email sent'});
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

/**
 * @desc    Reset password
 * @route   PUT /api/v1/auth/resetpassword/:resettoken
 * @access  Public
 * */
export const resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    });

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});


/**
 * @desc    Confirm Email
 * @route   GET /api/v1/auth/confirm/email
 * @access  Public
 * */
export const confirmEmail = asyncHandler(async (req, res, next) => {
    // grab token from email
    const {token} = req.query;

    if (!token) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    const splitToken = token.split('.')[0];
    const confirmEmailToken = crypto
        .createHash('sha256')
        .update(splitToken)
        .digest('hex');

    // get user by token
    const user = await User.findOne({
        confirmEmailToken,
        isEmailConfirmed: false,
    });

    if (!user) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    // update confirmed to true
    user.confirmEmailToken = undefined;
    user.isEmailConfirmed = true;

    // save
    user.save({validateBeforeSave: false});

    // return token
    sendTokenResponse(user, 200, res);
});


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};