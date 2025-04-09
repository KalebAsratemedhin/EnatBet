import Menu from "../models/Menu.js";
import MenuItems from "../models/MenuItems.js";
import { checkOwnership } from "../utils/index.js";
import Restaurant from "../models/Restaurant.js";



export const createMenu = async (req,res) =>{
     
    try{
        console.log("ayred")
        const restaurantId = req.params.id;
        const currentUserId = req.user.id;
        console.log(restaurantId)
        const restaurantOwner = await Restaurant.findById(restaurantId).populate("ownerId");
        console.log(restaurantOwner)
        if(!checkOwnership(restaurantOwner.ownerId._id,currentUserId)){

            return res.status(403).json({message:"unauthorized"});

        }

        const {name} =req.body;

        const newMenu = await Menu.create({
            name,
            restaurant:restaurantId
        });
      
        return res.status(201).json({
            message : 'Menu created successfully',
            menu:newMenu,
        });

    }catch(err){

        res.status(500).json({message: 'Error creating menu',err});

    }

};