import mongoose from "mongoose";

export const MenuItemsSchema =  new mongoose.Schema({
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
    },

    rating: {
        type:Number,
        min:0,
        max:5,
        default :0

    },

    totalRating :{
        type: Number,
        default :0
      },

  
})


const MenuSchema = mongoose.Schema({
    menuName :{
        type : String,required:true
    },
   
    restaurant : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Restaurant',

    },
    menuItems : [MenuItemsSchema]
});

const Menu = mongoose.model("Menu", MenuSchema);
export default Menu;
