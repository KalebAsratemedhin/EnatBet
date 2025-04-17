import Menu from "../models/Menu.js";
import { checkOwnership } from "../utils/index.js";
import Restaurant from "../models/Restaurant.js";

export const createMenu = async (req, res) => {
    try {
      console.log(" menus ", menuName, restaurant, menuItems)
      const { menuName, restaurant } = req.body;
      let menuItems = JSON.parse(req.body.menuItems); // Expect menuItems to be sent as a JSON string
  

      const currentUserId = req.user.id;
      const rest = await Restaurant.findById(restaurant);
      if (!rest) return res.status(404).json({ message: "Restaurant not found" });
  
      if (!checkOwnership(rest.ownerId, currentUserId)) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  
      // Map uploaded files to menuItems
      const files = req.files || [];
      menuItems = menuItems.map((item, index) => ({
        ...item,
        itemPicture: files[index]?.path || "", // fallback in case fewer images
      }));
  
      const menu = await Menu.create({ menuName, restaurant, menuItems });
      return res.status(201).json({ message: "Menu created", data: menu });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating menu", error: err.message });
    }
  };
  

export const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate("restaurant");
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    res.status(200).json({ data: menu });
  } catch (err) {
    res.status(500).json({ message: "Error fetching menu", error: err.message });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate("restaurant");
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const currentUserId = req.user.id;
    if (!checkOwnership(menu.restaurant.ownerId, currentUserId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const { menuName, menuItems } = req.body;

     // Map uploaded files to menuItems
     const files = req.files || [];
     menuItems = menuItems.map((item, index) => ({
       ...item,
       itemPicture: files[index]?.path || "", // fallback in case fewer images
     }));
     
    menu.menuName = menuName;
    menu.menuItems = menuItems;
    await menu.save();

    res.status(200).json({ message: "Menu updated", data: menu });
  } catch (err) {
    res.status(500).json({ message: "Error updating menu", error: err.message });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate("restaurant");
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const currentUserId = req.user.id;
    if (!checkOwnership(menu.restaurant.ownerId, currentUserId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Menu.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Menu deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting menu", error: err.message });
  }
};
