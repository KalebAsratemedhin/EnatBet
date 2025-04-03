import express from 'express'
import { signup, signin,logout, updateRoleRequest ,
       createRoleRequest, cancleRoleRequest } from '../controllers/auth.js';
import { isAuthenticated, isDeliveryPerson, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/signin',isDeliveryPerson,signin);
router.post('/logout', isAuthenticated, logout)
router.post('/auth/role-request',isAuthenticated, createRoleRequest)
router.post('/auth/role-request/cancelled',cancleRoleRequest);

router.put('/auth/role-request',isAdmin,updateRoleRequest)
export default router;