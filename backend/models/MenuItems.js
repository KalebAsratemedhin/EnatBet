import mongoose from "mongoose";

const MenuItemsSchema =  new mongoose.Schema({
    itemId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    name : { 
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true,
        min : [0,'Price cannot be negative']
    }
  
})

const MenuItems = mongoose.model("MenuItems" , MenuItemsSchema );

export default MenuItems;