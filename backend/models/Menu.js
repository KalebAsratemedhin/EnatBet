import mongoose from "mongoose";

const MenuItemsSchema =  new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
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
        min:1,
        max:5
    }

  
})


const MenuSchema = mongoose.Schema({
    menuName :{
        type :String,required:true
    },
   
    restaurant : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Restaurant',

    },
    menuItems : [MenuItemsSchema]
});

const Menu = mongoose.model("Menu", MenuSchema);
export default Menu;
