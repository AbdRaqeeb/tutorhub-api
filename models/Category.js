import mongoose from 'mongoose';
import slugify from 'slugify';

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters']
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, 'Description can not be more than 500 characters']
        },
        slug: String,
        photo: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

// add slugify when category is saved
CategorySchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

// Reverse populate with virtuals
CategorySchema.virtual('subjects', {
    ref: 'Subject',
    localField: '_id',
    foreignField: 'category',
    justOne: false
});

// cascade delete subjects when category is deleted
CategorySchema.pre('remove', async function (next) {
    console.log(`Subjects being removed from category ${this._id}`);
    await this.model('Subject').deleteMany({category: this._id});
    next();
});

export default mongoose.model('Category', CategorySchema);