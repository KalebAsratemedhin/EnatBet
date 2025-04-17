import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js'; 
import setupSwagger from './config/swagger.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import fileUpload from 'express-fileupload';
import restaurantRoutes from './routes/restaurant.js';

import menuRoutes from './routes/menu.js';
import dotenv from 'dotenv';
dotenv.config(); 


const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*', 
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

connectDB();
setupSwagger(app);

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use('/restaurant', restaurantRoutes);

app.use("/menu",menuRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 