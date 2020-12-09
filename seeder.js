import mongoose from 'mongoose';
import colors from 'colors';
import 'dotenv/config.js';


// models
import Category from './models/Category.js';
import Subject from './models/Subject.js';
import User from './models/User.js';
import Review from './models/Review.js';
import Booking from "./models/Booking.js";

// import data
import users from "./_data/users.js";
import categories from "./_data/categories.js";
import reviews from "./_data/reviews.js";
import bookings from "./_data/bookings.js";
import subjects from "./_data/subjects.js";

// connect to db
mongoose.connect(process.env.MONGO_URI_PROD, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});


// import data into DB
const importData = async () => {
  try {
      await Category.create(categories);
      await Subject.create(subjects);
      await User.create(users);
      await Review.create(reviews);
      await Booking.create(bookings);
      console.log('Data Imported...'.green.inverse);
      process.exit();
  } catch (e) {
      console.error(e);
  }
};

// delete data
const deleteData = async () => {
    try {
        await Category.deleteMany();
        await Subject.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();
        await Booking.deleteMany();
        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch (e) {
        console.error(e);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}