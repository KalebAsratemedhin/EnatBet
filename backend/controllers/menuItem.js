import { populate } from "dotenv";
import Menu from "../models/Menu.js";
import MenuItems from "../models/MenuItems.js";
import { checkOwnership } from "../utils/index.js";


export const addMenuItem = async (req,res)=>{

    try{
        const currentUserId = req.user.id;
        console.log(currentUserId);
        const menuId =req.params.id;
        
        console.log(menuId)
        const restaurantOwner = await Menu.findById(menuId).populate({path:"restaurant",populate:{path:'ownerId'}});
        console.log(restaurantOwner.restaurant.ownerId);
        if(!checkOwnership(restaurantOwner.restaurant.ownerId._id,currentUserId)){

            res.status(403).json({message: "Unauthorized Access"});
        }
        
        if(!req.file.path){

            return res.error('picture is required',404);
            
        }

        const {name,description,price} = req.body;

        const menuItem = await MenuItems.create({
            name,
            description,
            price,
            itemPicture :req.file.path,
            menu:menuId
        })
        await Menu.findByIdAndUpdate(menuId,{
            $push: {menuItems:menuItem._id},
        });

     return res.status(201).json({message: "Menu item created successfuly",data :menuItem});

    }catch(err){
        console.log(err.message);
        res.status(500).json({message:err.message})
    }
}


export const updateMenuItem = async (req,res) =>{
    
    try{
        const currentUserId = req.user.id;
        const menuItemId =req.params.id;

        const restaurantOwner = await MenuItems.findById(menuItemId).populate({path:"menu" , populate:{path:"restaurant",populate:{path:"ownerId"}}});

        if(!checkOwnership(restaurantOwner.menu.restaurant.ownerId._id,currentUserId)){
            return res.status(403).json({message: "Access denied "})
        }

        const {name,description,price} = req.body;

        const updatedMenuItem = await MenuItems.findByIdAndUpdate(menuItemId,{
            name :name,
            description :description,
            price :price,
            itemPicture : req.file.path

        })

        return res.status(200).json({message: "Menu item updated successfully", data:updatedMenuItem})
        
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Something went Wrong",error:error.message})
    }


}