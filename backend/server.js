import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js'; 
import testRoutes from './routes/testRoutes.js'
import setupSwagger from './config/swagger.js';
import authRoute from './routes/auth.js'
dotenv.config(); 

const app = express();
app.use(express.json());

connectDB();

setupSwagger(app);

app.use('/api/test', testRoutes);

app.use('/auth',authRoute);

app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
