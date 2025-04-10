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
        const menuItem = await Menu.findById(menuId).populate({path:"restaurant",populate:{path:'ownerId'}});
        if(!checkOwnership(menuItem.restaurant.ownerId._id,currentUserId)){

            res.status(403).json({message: "Unauthorized Access"});
        }
        
        if(!req.file.path){

            return res.error('picture is required',404);
            
        }

        const {name,description,price} = req.body;

        const newMenuItem = await MenuItems.create({
            name,
            description,
            price,
            itemPicture :req.file.path,
            menu:menuId
        })
        await Menu.findByIdAndUpdate(menuId,{
            $push: {menuItems:newMenuItem._id},
        });

     return res.status(201).json({message: "Menu item created successfuly",data :newMenuItem});

    }catch(err){
        console.log(err.message);
        res.status(500).json({message:err.message})
    }
}


export const updateMenuItem = async (req,res) =>{
    
    try{
        const currentUserId = req.user.id;
        const menuItemId =req.params.id;

        const menuItem = await MenuItems.findById(menuItemId).populate({path:"menu" , populate:{path:"restaurant",populate:{path:"ownerId"}}});

        if(!checkOwnership(menuItem.menu.restaurant.ownerId._id,currentUserId)){
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
        
    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Something went Wrong",err:err.message})
    }


}

export const removeMenuItem = async (req,res) =>{

       try{

        const currentUserId = req.user.id;
        const menuItemId = req.params.id;

        const menuItem = await MenuItems.findById(menuItemId).populate({path : "menu" , populate:{path : "restaurant", populate:{path: "ownerId"}}});

        if(!checkOwnership(menuItem.menu.restaurant.ownerId._id,currentUserId)){
            return res.status(403).json({message : "Access denied"})
        }


         await Menu.findByIdAndUpdate(menuItem.menu._id,{
            $pull:{menuItems :menuItemId}});

         await MenuItems.findByIdAndDelete(menuItemId);

         return res.status(200).json({message: "Menu Item deleted successfully"});

       }catch(err){

        console.log(err.message);
        res.status(500).json({message:"Something went wrong",err: err.message});

       }


}