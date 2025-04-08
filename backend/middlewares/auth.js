import jwt from 'jsonwebtoken'
import BlacklistedToken from '../models/BlacklistedToken.js'

export const isAuthenticated = async (req,res,next) =>{
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        const token = authHeader.split(' ')[1].trim();
        // req.headers.authorization?.split(' ')[1];
        if(!token) throw new Error('No token provided');

        const isBlacklisted = await BlacklistedToken.exists({token});
        if (isBlacklisted) throw new Error('Token invalidated');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {id: decoded.id,role: Array.isArray(decoded.role) ? decoded.role : [decoded.role]};
        next();
    }catch (err){
        res.status(401).json({error : 'Authentication failed: ' + err.message});
    }

};
 
export const isDeliveryPerson = async (req,res,next) =>{
    
        if( !req.user.role.includes("Delivery_person")){

            return res.status(403).json({message : 'Access denied'});
        }

         next();
         
  
};

export const isRestaurantOwner = async (req,res,next) =>{

             if(!req.user.role.includes("restaurant_owner")){
                return res.status(403).json({message:"Access denied"})
             }
               next()
}

export const isAdmin = async (req,res,next)=>{

    if(!req.user.role.includes("Admin")){

        return res.status(403).json({message:"Access denied"})
        
      }
  next()
}

