import mongoose from 'mongoose';

export const connectToDatabase = async () => {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        throw new Error('MONGO_URI is not defined in .env');
    }

    try {
        await mongoose.connect(mongoURI);
        console.log('✌ Connected to MongoDB successfully!✌');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    }
};
