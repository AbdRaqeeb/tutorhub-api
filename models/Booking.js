import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    tutor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        required: true
    },
    date: {
        type: Date,
        default: Date.now() + 10 * 60 * 1000,
        required: [true, 'Please add a date for the tutorial']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'canceled', 'finished', 'rejected'],
        default: 'pending'
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    }
});

export default mongoose.model('Booking', BookingSchema);