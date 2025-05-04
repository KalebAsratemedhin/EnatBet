import Menu from "../models/Menu.js";
import { checkOwnership } from "../utils/index.js";
import Restaurant from "../models/Restaurant.js";


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

export const getMenusByRestaurant = async (req,res) =>{

    try{
        const restaurantId = req.params.id;
        const menus = await Menu.find({restaurant:restaurantId});
        if (!menus) {
            return res.status(404).json({ message: "No Menus found" });
          }
      
        res.status(200).json({menus});
    }catch(err){

        res.status(500).json({message:"Something went wrong"});

    }

}

export const getMenuById = async (req,res) =>{

    try{
        const id = req.params.id;
        const menu = await Menu.findById(id);
        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
          }
      
        res.status(200).json(menu);
    }catch(err){

        res.status(500).json({message:"Something went wrong"});

    }
}

export const updateMenu = async (req, res) => {
    try {
      const menuId = req.params.id;
      const currentUserId = req.user.id;
  
      const menu = await Menu.findById(menuId).populate({
        path: "restaurant",
        populate: { path: "ownerId" },
      });
  
      if (!menu) return res.status(404).json({ message: "Menu not found" });
  
      const restaurantOwnerId = menu.restaurant.ownerId._id;
  
      if (!checkOwnership(restaurantOwnerId, currentUserId)) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      const { menuName, menuItems } = req.body;
      const parsedItems = JSON.parse(menuItems);
      const files = req.files || [];
  
      const imageMap = {};

      files.forEach((file) => {
        const fieldname = file.fieldname;
        
        const ind = (fieldname.split("-")[1]);

        imageMap[ind] = file.path;
      });

      const updatedItems = parsedItems.map((item, index) => {
       
        const newItem = {
          name: item.name,
          description: item.description,
          price: item.price,
          itemPicture:  imageMap[index.toString()] ? imageMap[index.toString()]  : item.itemPicture,
        };
  
        if (item._id) {
          newItem._id = item._id;
        }
  
        return newItem;
      });
  
      // Apply updates
      menu.menuName = menuName || menu.menuName;
      menu.menuItems = updatedItems;
  
      await menu.save();
  
      return res.status(200).json({
        message: "Menu updated successfully",
        menu,
      });
    } catch (err) {
      res.status(500).json({ message: "Error updating menu", error: err.message });
    }
};
  
export const deleteMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const currentUserId = req.user.id;

    const menu = await Menu.findById(menuId).populate("restaurant");

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    if (!checkOwnership(menu.restaurant.ownerId._id, currentUserId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await menu.deleteOne();

    return res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
