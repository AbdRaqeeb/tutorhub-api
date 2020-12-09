import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
        title: {
            type: String,
            required: [true, 'Please add a title'],
            maxlength: [50, 'Title cannot be moe than 50 characters'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, 'Description can not be more than 500 characters']
        },
        duration: {
            type: Number,
            required: [true, 'Please add subject tutorial duration']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: true
        },
        tutors: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    }
);

SubjectSchema.pre('find', function (next) {
    this.populate({
        path: 'tutors',
        select: 'name email rate'
    });
    next();
});

export default mongoose.model('Subject', SubjectSchema);