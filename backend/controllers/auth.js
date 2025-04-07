import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import 'dotenv/config' 
import RoleRequest from '../models/RoleRequest.js'
import BlacklistedToken from '../models/BlacklistedToken.js'


export const signup = async (req,res)=>{
    try {
        const { name,email,password,phoneNumber,address} = req.body;

        //hash password
         const hashedPassword = await bcrypt.hash(password,12);

         const user = await User.create(
            {name , email,password : hashedPassword,phoneNumber,address,role:['customer']}
         );
         
         // Generate token
         const token = jwt.sign({id:user._id,role: Array.isArray(user.role) ? user.role[0] : user.role},process.env.JWT_SECRET,{
            expiresIn :'7d'
        });

         res.status(201).json({token, user: { id: user._id, name:name, email:email,role: Array.isArray(user.role) ? user.role[0] : user.role}});
    } catch (error) {
        res.status(400).json({error: error.message});
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
        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{
            expiresIn :'7d'
        });
        res.json({token, user : { id : user._id,role : user.role }} )
    }catch(error){
       res.status(401).json({error : error.message});
    }
};

export const logout = async (req,res) => {
    try{

      const authHeader = req.headers.authorization || req.headers.Authorization;

      const token = authHeader.split(' ')[1].trim();

      //add to blacklist
      await BlacklistedToken.create({token : token});
    
      res.json({message:'logged out successfully'});
      
    }catch(error)
    {
        res.status(400).json({error:error.message});
    }
};


export const getCurrentUser = async (req,res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) throw new Error('User not found');

        res.status(200).json(user);
    }catch(error){
        res.status(400).json({error:error.message});
    }
}

//create role request
export const createRoleRequest = async (req,res) =>{
     
     try{
        const {requestedRole,remark} = req.body;

        const newRoleRequest = await RoleRequest.create({

            userId: req.user.id,
            requestedRole,
            remark,
            status:'pending'

        });

    res.status(201).json({message : "Request submitted"})

     }catch(error){

     res.status(500).json({message : "Failed to request"})

    };
};

//cancel role request
export const cancelRoleRequest = async (req,res) =>{

    try{
        const requestId = req.params.requestId;
    
        const request = await RoleRequest.findById(requestId);
       
        console.log(request)

        if(!request || request.status !== 'pending'){
            return res.status(404).json({ message : 'No pending request found to cancel'});
        }
        request.status ="cancelled";

        await request.save()

        res.status(200).json({message : 'Request cancelled successfully'})

    }catch(error){

    res.status(500).json({message : "Failed to cancel request"});
    }
};

// add new role to user
const addRoleToUser = async(user_Id,newRole) =>{

    const user = await User.findById(user_Id);

     if(!user){

       throw new Error('User not found')

     }

    //  console.log(!user.role.includes(newRole));

     if(!user.role.includes(newRole)){
       try{
         user.role.push(newRole[0]);

         await user.save();

         return user

       }catch(err){

        console.log("Error whaile saving")

       }

     }
    

}


//update role request 
export const updateRoleRequest = async (req,res) =>{

    try{
        console.log(req.body)
        const {requestId,status} = req.body;
        
        // console.log(mongoose.Types.ObjectId.isValid(requestId))
          
        const request = await RoleRequest.findById(requestId);

        console.log(request)

        if(!request){

            return res.status(404).json({message : " Request not  found" });
            
        }
         
        request.status = status;
 
        await request.save();
        console.log(request.status);
        if (request.status === 'approved'){
           
            await addRoleToUser(request.userId,request.requestedRole )

            res.status(200).json({message : 'Role Added successfully'})

        }    

    } catch (error) {

        res.status(500).json({message: 'Failed to update request status'});

    }
};

export const getMyRoleRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const requests = await RoleRequest.find({ userId });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch role requests' });
    }
}

export const getAllRoleRequests = async (req, res) => {
    try {
        const requests = await RoleRequest.find();

        res.status(200).json(requests);

    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch role requests' });
    }
}