import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    tutor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// Static method to get avg rating and save
ReviewSchema.statics.getTutorAverageRating = async function(tutorId) {
    const obj = await this.aggregate([
        {
            $match: { tutor: tutorId }
        },
        {
            $group: {
                _id: '$tutor',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('User').findByIdAndUpdate(tutorId, {
            averageRating: obj[0].averageRating
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageCost after save
ReviewSchema.post('save', async function() {
    await this.constructor.getTutorAverageRating(this.tutor);
});

// Call getAverageCost before remove
ReviewSchema.post('remove', async function() {
    await this.constructor.getTutorAverageRating(this.tutor);
});

export default mongoose.model('Review', ReviewSchema);