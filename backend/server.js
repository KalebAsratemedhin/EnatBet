import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'; // ✅ Import CORS
import connectDB from './config/db.js'; 
import testRoutes from './routes/testRoutes.js';
import setupSwagger from './config/swagger.js';

import authRoute from './routes/auth.js'
import restaurantRoutes from './routes/restaurant.js';

import menuRoutes from './routes/menu.js'
dotenv.config(); 


const app = express();

// ✅ Setup CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*', 
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
setupSwagger(app);

app.use('/api/test', testRoutes);


app.use('/auth',authRoute);

app.use('/restaurant', restaurantRoutes);

app.use("/menu",menuRoutes);

app.use(express.urlencoded({ extended: true }))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
