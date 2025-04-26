import express from 'express'
import { signup, signin,logout, getCurrentUser} from '../controllers/auth.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup',signup);

router.post('/signin',signin); 

router.post('/logout', isAuthenticated, logout)

router.get('/current-user', isAuthenticated, getCurrentUser);

export default router;