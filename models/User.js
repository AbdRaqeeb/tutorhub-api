import crypto from 'crypto';
import mongoose from 'mongoose';
import geocoder from '../utils/geocoder.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a unique username'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ]
    },
    role: {
        type: String,
        enum: ['user', 'tutor', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    image: String,
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
        countryCode: String
    },
    subjects: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Subject'
        }
    ],
    rate: {
        type: Number
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Encrypt password before saving to database
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign jwt and returns
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({id: this._id, location: this.location.formattedAddress, email: this.email}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Geocode & create location field
UserSchema.pre('save', async function (next) {
    if (!this.isModified('address')) {
        next();
    }
    const loc = await geocoder.geocode(this.address);
    if (loc.length === 0) {
        next();
    }
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].extra.neighborhood,
        city: loc[0].administrativeLevels.level2long,
        state: loc[0].administrativeLevels.level1long,
        zipcode: loc[0].zipcode,
        country: loc[0].country,
        countryCode: loc[0].countryCode
    };

    // Do not save address in DB
    // this.address = undefined;
    next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// Generate email confirm token
UserSchema.methods.generateEmailConfirmToken = function (next) {
    // email confirmation token
    const confirmationToken = crypto.randomBytes(20).toString('hex');

    // set confirmEmailToken
    this.confirmEmailToken = crypto.createHash('sha256').update(confirmationToken).digest('hex');

    const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
    return `${confirmationToken}.${confirmTokenExtend}`;
};


export default mongoose.model('User', UserSchema);