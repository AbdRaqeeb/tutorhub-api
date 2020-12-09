import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import geocoder from '../utils/geocoder.js';

/**
 * @desc    Get tutors
 * @route   GET /api/v1/tutors
 * @access  Public
 * */
export const getTutors = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

/**
 * @desc    Gets single tutor
 * @route   GET /api/v1/tutors/:tutorId
 * @access  Public
 * */
export const getTutor = asyncHandler(async (req, res, next) => {
    const tutor = await User.findById(req.params.id).populate({
        path: 'subjects',
        select: 'title',
        populate: {
            path: "category",
            select: "name"
        }
    });

    if (!tutor) {
        return next(
            new ErrorResponse(`Tutor with the id ${req.params.id} not found`, 404)
        );
    }
    return res.status(200).json({
        success: true,
        data: tutor
    })
});

/**
 * @desc    Get tutors within a radius
 * @route   GET /api/v1/tutors/radius/:zipcode/:distance
 * @access  Public
 * */
export const getTutorsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const tutors = await User.find({
        location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}},
        role: 'tutor'
    });

    res.status(200).json({
        success: true,
        count: tutors.length,
        data: tutors
    });
});

/**
 * @desc    Register for subject
 * @route   POST /api/v1/subjects/:subjectId/tutors
 * @access  Private
 * */
export const registerSubject = asyncHandler(async (req, res, next) => {
    let tutor = await User.findById(req.user.id);

    let subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
        return next(
            new ErrorResponse(`Subject with the ID ${req.params.id} not found`, 404)
        );
    }

    // add tutor id to array of subject tutors
    if (subject.tutors.includes(tutor._id)) {
        return next(
            new ErrorResponse(`Tutor has already registered for subject with ID ${req.params.subjectId}`)
        );
    } else {
        await subject.tutors.push(tutor._id);
    }

    // add subject id to array of tutors subject
    await tutor.subjects.push(req.params.subjectId);

    await subject.save();
    await tutor.save();

    const user = await User.findById(req.user.id).populate({
        path: "subjects",
        select: "title",
        populate: {
            path: "category",
            select: "name"
        }
    });

    res.status(200).json({
        success: true,
        data: user
    })
});

/**
 * @desc    Unegister for subject
 * @route   PUT /api/v1/subjects/:subjectId/tutors
 * @access  Private
 * */
export const unRegisterSubject = asyncHandler(async (req, res, next) => {
    let tutor = await User.findById(req.user.id);

    let subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
        return next(
            new ErrorResponse(`Subject with the ID ${req.params.id} not found`, 404)
        );
    }

    // remove subject id from array of tutors subject
    if (tutor.subjects.includes(req.params.subjectId)) {
        // find index of subject
        const index = tutor.subjects.indexOf(req.params.subjectId);

        // remove from array
        await tutor.subjects.splice(index, 1)

    } else {
        return next(
            new ErrorResponse(`Tutor did not register for subject with ID ${req.params.subjectId}`)
        );
    }

    await tutor.save();

    const user = await User.findById(req.user.id).populate({
        path: "subjects",
        select: "title",
        populate: {
            path: "category",
            select: "name"
        }
    });

    res.status(200).json({
        success: true,
        data: user
    })
});