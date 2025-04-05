import jwt from 'jsonwebtoken'
import BlacklistedToken from '../models/BlacklistedToken.js'

export const isAuthenticated = async (req,res,next) =>{
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        const token = authHeader.split(' ')[1].trim();
        // console.log(token);
        // req.headers.authorization?.split(' ')[1];
        if(!token) throw new Error('No token provided');

        const isBlacklisted = await BlacklistedToken.exists({token});
        if (isBlacklisted) throw new Error('Token invalidated');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {id: decoded.id,role: Array.isArray(decoded.role) ? decoded.role[0] : decoded.role};
        next();
    }catch (err){
        res.status(401).json({error : 'Authentication failed: ' + err.message});
    }

};
 
export const isDeliveryPerson = async (req,res,next) =>{
    
        if( req.user.role !== "Delivery_person"){

            return res.status(403).json({message : 'Access denied'});
        }

         next();
         
  
};

export const isRestaurantOwner = async (req,res,next) =>{
         
             if(req.user.role !== "Restaurant_woner"){
                return res.status(403).json({message:"Access denied"})
             }
               next()
}

export const isAdmin = async (req,res,next)=>{

    if(req.user.role !== "Admin"){

        return res.status(403).json({message:"Access denied"})
        
      }
  next()
}

