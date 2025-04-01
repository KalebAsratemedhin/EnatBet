import express from 'express';
import connectDB from './config/db.js'; 
import dotenv from 'dotenv';
import testRoutes from './routes/testRoutes.js'
import setupSwagger from './config/swagger.js';

dotenv.config(); 

const app = express();
app.use(express.json());

connectDB();

setupSwagger(app);

app.use('/api/test', testRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 