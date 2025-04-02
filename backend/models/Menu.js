import mongoose from "mongoose";

const MenuSchema = mongoose.Schema({
    MenuId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    RestaurantId : {
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