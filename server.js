import express from 'express';
import 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import colors from 'colors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import { config } from 'cloudinary-simple-upload';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import { errorHandler } from './middleware/error.js';
import connectDB from './config/db.js';


// connect to database
connectDB()
    .catch(err => console.log('Error connecting to database', err));

// connect to cloudinary
config(process.env.CLOUD_NAME, process.env.API_KEY, process.env.API_SECRET);

// Import routes
import categories from './routes/category.js';
import subjects from './routes/subject.js';
import auth from './routes/auth.js';
import reviews from './routes/review.js';
import tutors from './routes/tutor.js';
import users from './routes/users.js';
import bookings from './routes/booking.js'

const app = express();

//Body parser
app.use(express.json({ extended: false }));

// file upload
app.use(fileUpload());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet({
        contentSecurityPolicy: false,
    }
));

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/categories', categories);
app.use('/api/v1/subjects', subjects);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/tutors', tutors);
app.use('/api/v1/users', users);
app.use('/api/v1/bookings', bookings);
app.use('/', (req, res) => {
    return res.status(200).json({
        message: 'Let\'s build',
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    // close server and exit processes
    // server.close(() => process.exit(1))
});
