import Menu from "../models/Menu.js";
import { checkOwnership } from "../utils/index.js";
import Restaurant from "../models/Restaurant.js";



export const createMenu = async (req,res) =>{
     
    try{

        const restaurantId = req.params.id;
        const currentUserId = req.user.id;

        const restaurantOwner = await Restaurant.findById(restaurantId).populate("ownerId");
        
        if(!checkOwnership(restaurantOwner.ownerId._id,currentUserId)){

            return res.status(403).json({message:"unauthorized"});

        }

        const {menuName} =req.body;

        const newMenu = await Menu.create({
            menuName,
            restaurant:restaurantId
        });

        await Restaurant.findByIdAndUpdate(restaurantId,{
            $push:{menu:newMenu._id}
        })

        return res.status(201).json({
            message : 'Menu created successfully',
            menu:newMenu,
        });

    }catch(err){

        res.status(500).json({message: 'Error creating menu',err});

    }

};

export const getMenu = async (req,res) =>{

    try{
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate("menu");

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
          }
      
        res.status(200).json({menu:restaurant.menu});

    }catch(err){

        console.log(err.message);
        res.status(500).json({message:"Something went wrong"});

    }

}