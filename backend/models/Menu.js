import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  itemPicture: { type: String },
});

const MenuSchema = new mongoose.Schema({
  menuName: { type: String, required: true },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  items: [MenuItemSchema], // Embedded items here
});

const Menu = mongoose.model("Menu", MenuSchema);
export default Menu;
