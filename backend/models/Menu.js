import mongoose from "mongoose";

const MenuSchema = mongoose.Schema({
    menuId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    restaurantId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Restaurant',

    },
    itemId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'MenuItems',
        required : true,
    }
})

const Menu = mongoose.model('Menu' , MenuSchema );

export default Menu;