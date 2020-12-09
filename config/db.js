import mongoose from 'mongoose';

const connectDB = async () => {
    let URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI;
    const conn = await mongoose.connect(URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDb Connected: ${conn.connection.host}`.underline.bold.blue);
};

export default connectDB;