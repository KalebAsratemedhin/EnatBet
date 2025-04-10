import mongoose from "mongoose";

const MenuItemsSchema =  new mongoose.Schema({
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
    },

    itemPicture:{ 
        type:String
    },
    
    menu:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Menu"
    }
  
})

const MenuItems = mongoose.model("MenuItems" , MenuItemsSchema );

export default MenuItems;