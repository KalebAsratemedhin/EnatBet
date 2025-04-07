import mongoose from 'mongoose';
import 'dotenv/config';



const connectDB = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1); 
  }
};
export default connectDB;
