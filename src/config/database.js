import mongoose from 'mongoose';
import config from './config.js'; // Adjust the path as necessary

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongodbUrl, {
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB; 


