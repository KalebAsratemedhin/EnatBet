import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import dotenv from 'dotenv'
import RoleRequest from '../models/RoleRequest.js'
import { request } from 'express'

dotenv.config();

export const signup = async (req,res)=>{
    try {
        const { name,email,password,phoneNumber,address} = req.body;

        //hash password
         const hashedPassword = await bcrypt.hash(password,12);

         const user = await User.create(
            {name , email,password : hashedPassword,phoneNumber,address,role:['customer']}
         );
         
         // Generate token
         const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{
            expiresIn :'7d'
        });

         res.status(201).json({token, user: { id: user._id, name, email}});
    } catch (error) {
        res.status(400).json({error: err.message});
    }


};

// signin
export const signin = async (req,res) =>{

    try{
        const {email,password} =req.body;

        // Find user 
        const user = await User.findOne({email}).select("+password");
        if (!user) throw new Error("Invalid credential");

        //Verify password
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        //Generate token
        const token = generateToken(user._id);
        res.json({token, user:{id:user._id,role:user.role}})
    }catch(error){
       res.status(401).json({error:err.message});
    }
};

export const logout = async (req,res)=>{
    try{
      const token = req.headers.autorization?.split(' ')[1];

      //add to blacklist
      await BlacklistedToken.create({token});

      res.json({message:'logged out successfully'});
    }catch(error)
    {
        res.status(400).json({error:err.message});
    }
};

//create role request
export const createRoleRequest = async (req,res) =>{
     
     try{
        const {additionalRole,remark} = req.body;

        await RoleRequest.create({
            userId: req.user._id,
            additionalRole,
            remark,
            status:'pending'
        });

    res.status(201).json({message : "Request submitted"})

     }catch(error){

     res.status(500).json({message : "Failed to request"})

    };
};

//cancel role request
export const cancleRoleRequest = async (req,res) =>{

     try{
       const request = await RoleRequest.find({ userId : req.user.id, status : 'pending'});

         if(!request){
            return res.status(404).json({ message : 'No pending request found to cancel'});
           }

            request.status = 'cancelled';
            await request.save();

             res.status(200).json({message : 'Request cancelled successfully'})

        }catch(error){
                 res.status(500).json({message : "Failed to cancel request"});
}
};

// add new role to user
const addRoleToUser = async(user_Id,newRole) =>{
       
     const user = await User.findOne( {userId : user_Id});
     
     if(!user){
       throw new Error('User not found')
     }
     
     if(!user.role.includes(newRole)){

         user.role.push(newRole);
         await user.save();

     }

}


//update role request 
export const updateRoleRequest = async (req,res) =>{

    try{
        const {userId,status} = req.body;

        request = await RoleRequest.findById(userId);
        
        if(!request){

            return res.status(404).json({
                message : " Request not  found"
            });
        }
         
        request.status = status;

        await request.save();
        
        if (status === 'approved'){
            await addRoleToUser(request.userId,request.requestedRole )
        }
        

    } catch (error) {
        res.status(500).json({message: 'Failed to update request status'});
    }
};