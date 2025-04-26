
import express from 'express'
import {updateRoleRequest ,
       createRoleRequest, 
       getAllRoleRequests,
       getMyRoleRequests,
       toggleCancelRoleRequest} from '../controllers/auth.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';

const router = express.Router();


router.post('/',isAuthenticated, createRoleRequest);

router.put('/cancelled/:requestId', isAuthenticated, toggleCancelRoleRequest);

router.put('/:requestId',isAuthenticated, isAdmin, updateRoleRequest)

router.get('/mine', isAuthenticated, getMyRoleRequests);

router.get('/all', isAuthenticated, isAdmin, getAllRoleRequests);

export default router;
