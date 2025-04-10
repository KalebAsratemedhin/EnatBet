import mongoose from "mongoose";

const MenuSchema = mongoose.Schema({
    menuName :{
        type :String,required:true
    },
   
    restaurant : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Restaurant',

    },
    menuItems : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'MenuItems',
        required : true,
    }]
});

const Menu = mongoose.model('Menu' , MenuSchema );

export default Menu;