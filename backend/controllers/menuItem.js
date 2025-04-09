import Menu from "../models/Menu";
import MenuItems from "../models/MenuItems";
import { checkOwnership } from "../utils";


export const addMenuItem = async (req,res)=>{

    try{
        const currentUserId = req.user.id;
        const menuId =req.parmas.id;
        const restaurantOwner = await Menu.findById(menuId).populate({path:"restaurant",populate:{path:'ownerId'}});

        if(!checkOwnership(restaurantOwner.ownerId._id,currentUserId)){

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


    }catch(err){
        console.log(err.message);
        res.status(500).json({message:err.message})
    }
}