import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import sendEmail from "../utils/sendEmail.js";

// models
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";


/**
 * @desc    Get bookings
 * @routes  GET /api/v1/bookings
 * @access  Private / Admin
 * */
export const getBookings = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single booking
 * @routes  GET /api/v1/bookings/:id
 * @access  Private
 * */
export const getBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id)
        .populate({
            path: "tutor user",
            select: "name, email"
        })
        .populate({
                path: "subject",
                select: "title",
                populate: {
                    path: "category",
                    select: "name"
                }
            }
        );

    if (!booking) {
        return next(
            new ErrorResponse(`Booking with the ID ${req.params.id} not found`, 404)
        );
    }

    if (req.user.id !== booking.user && req.user.id !== booking.tutor && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User not authorized to access resource`, 405)
        );
    }

    res.status(200).json({
        success: true,
        data: booking
    })
});

/**
 * @desc    Add booking
 * @routes  POST /api/v1/subjects/:subjectId/bookings
 * @access  Private
 * */
export const createBooking = asyncHandler(async (req, res, next) => {
    const subject = await Subject.findById(req.params.subjectId);

    if (!subject) {
        return next(
            new ErrorResponse(`Subject with the ID ${req.params.subjectId} not found`, 404)
        )
    }

    // search for tutor
    const tutor = await User.findById(req.body.tutor);

    // add body fields
    req.body.user = (req.body.user) ? req.body.user : req.user.id;
    // req.body.amount = tutor.rate;
    req.body.amount = 2000;
    req.body.duration = subject.duration;
    req.body.address = (req.body.address) ? req.body.address : req.user.address;
    req.body.subject = req.params.subjectId;

    const booking = await Booking.create(req.body);

    // Retrieve subject & category name from booking
    const details = await getDetails(booking._id);

    //create confirm url
    const bookingURL = `${req.protocol}://${req.get('host')}/api/v1/bookings/:id/status`;
    const message = `You are receiving this email because a user booked a ${details.subject.title} of category ${details.subject.category.name} with you at address: ${details.address}. Please make a PUT request with your decision to: \n\n ${bookingURL}`;

    await sendEmail({
        email: tutor.email,
        subject: 'Tutorial Session Booking',
        message
    });

    res.status(201).json({
        success: true,
        data: details
    });
});

/**
 * @desc    Update booking status
 * @routes  PUT /api/v1/bookings/:id/status
 * @access  Private
 * */
export const updateBookingStatus = asyncHandler(async (req, res, next) => {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(
            new ErrorResponse(`Booing with the ID ${req.params.id} not found`, 404)
        );
    }

    if (req.user.id !== booking.user && req.user.id !== booking.tutor && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User not authorized to access resource`, 405)
        );
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    res.status(200).json({
        success: true,
        data: booking
    });
});

/**
 * @desc    Update booking to paid
 * @routes  PUT /api/v1/bookings/:id/pay
 * @access  Private
 * */
export const updateBookingToPaid = asyncHandler(async (req, res, next) => {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(
            new ErrorResponse(`Booing with the ID ${req.params.id} not found`, 404)
        );
    }

    booking.isPaid = true;
    booking.paidAt = Date.now();
    booking.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
    };

    await booking.save();

    // Get booking details
    const details = await getDetails(booking._id);

    res.status(200).json({
        success: true,
        data: details
    });
});

/**
 * @desc    Delete booking
 * @routes  DELETE /api/v1/bookings/:id
 * @access  Private
 * */
export const deleteBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(
            new ErrorResponse(`Booking with the ID ${req.params.id} not found`, 404)
        );
    }

    await booking.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

const getDetails = async (id) => {
    const details = await Booking.findById(id).populate({
        path: "subject",
        select: "title",
        populate: {
            path: "category",
            select: "name"
        }
    }).populate({
        path: "user",
        select: "name email"
    }).populate({
        path: "tutor",
        select: "name email"
    });

    return details;
};