import Menu from "../models/Menu.js";
import { checkOwnership } from "../utils/index.js";
import Restaurant from "../models/Restaurant.js";

export const createMenu = async (req, res) => {
    try {
      console.log(" menus ", menuName, restaurant, menuItems)
      const { menuName, restaurant } = req.body;
      let menuItems = JSON.parse(req.body.menuItems); // Expect menuItems to be sent as a JSON string
  

export const createMenu = async (req,res) =>{
     
    try{

        const restaurantId = req.params.id;
        const currentUserId = req.user.id;

        const restaurantOwner = await Restaurant.findById(restaurantId).populate("ownerId");
        
        if(!restaurantOwner) return res.status(404).json({message: "Restaurant not found"});
        

        if(!checkOwnership(restaurantOwner.ownerId._id,currentUserId)){

            return res.status(403).json({message:"unauthorized"});

        }

        const { menuName, menuItems } = req.body;
        const parsedItems = JSON.parse(menuItems); // safely parse JSON string
        const files = req.files["itemPictures"];

        const finalItems = parsedItems.map((item, index) => ({
            ...item,
           itemPicture: files[index]?.path // attach image path
          }));

        const newMenu = await Menu.create({
        menuName,
        menuItems: finalItems,
        restaurant: restaurantId
        });


        await Restaurant.findByIdAndUpdate(restaurantId,{
            $push:{menu:newMenu._id}
        },{new: true})

        return res.status(201).json({
            message : 'Menu created successfully',
            menu:newMenu,
        }); 

    }catch(err){

        res.status(500).json({message: 'Error creating menu',err:err.message});

    }

};

export const getMenuByRestaurant = async (req,res) =>{

    try{
        const restaurantId = req.params.id;
        const menu = await Menu.findOne({restaurant:restaurantId});

        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
          }
      
        res.status(200).json({menu});

    }catch(err){

        console.log(err.message);
        res.status(500).json({message:"Something went wrong"});

    }

}

export const updateMenu =async (req,res)=>{
    try{
        const menuId = req.params.id;
        const currentUserId = req.user.id

        const {menuName,menuItems} = req.body;

        const parsedItems = JSON.parse(menuItems);

        const files = req.files["itemPictures"]

        const menu = await Menu.findById(menuId).populate({path:"restaurant",populate:{path:"ownerId"}});

        if (!menu) return res.status(404).json({message :"Menu not found"});

        if(!checkOwnership(menu.restaurant.ownerId._id,currentUserId)) return res.status(403).json({message: "Access denied"});
        
        if(menuName) menu.menuName = menuName;

        const updatedItmes = parsedItems.map((item,index)=> {

        const picture = files && files[index] ? files[index].path:undefined;
         
         return {
            name:item.name,
            description:item.description,
            price:item.price,
            itemPicture:picture || item.itemPicture,
            _id:item._id

         }
        });

        if(menuItems) menu.menuItems = updatedItmes;
        
        await menu.save();
        const cleanMenu = menu.toObject();
        delete cleanMenu.restaurant
        res.status(200).json({message: "Menu updated successfully ",cleanMenu});

    }catch (err){

        console.log(err);
        res.status(500).json({message:"Error updating menu",error:err.message});

    }
}

export const deleteMenu = async (req,res) => {

    try{

        const restaurantId = req.params.id;

        const currenUserId = req.user.id;

        const menu = await Menu.findOne({restaurant:restaurantId}).populate("restaurant");

        if(!checkOwnership(menu.restaurant.ownerId._id,currenUserId)) return res.status(403).json({message:"Access denied"});

        await Restaurant.findByIdAndUpdate(restaurantId,{
            $pull: {menu:menu._id}
        },{new:true});

        await Menu.findOneAndDelete({restaurant: restaurantId});

        return res.status(200).json({message:"Menu deleted successfully"});

    }catch(err){
        return res.status(500).json({message : "something wen wrong"});
    }

}