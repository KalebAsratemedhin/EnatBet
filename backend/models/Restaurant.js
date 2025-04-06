import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
    {
    restaurantId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        unique : true ,
        index:true},
    ownerId : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    name : {
        type : String,
        required : true
    },
    locaton : 
    {
        type :
         {
            type : String,
            enum : ['Point'],
            required : true
        },
             Coordinates : 
             {
                type : number , required : true
            },
             address : string
          },
    menu : 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Menu'
    },
    rating :
     {
        type : number,
        min : 0,
        max : 5,
        default : 0
    },
    deliverAreas : 
    {
         type:[String]},

    promotion:[
        {
            title:String,
            description:String,
            discount:Number,
            validuntil:Date
        }],
    isApproved : {
    type : Boolean,
    default : false

    }

})

RestaurantSchema.index({Location:"2dsphere"});

const Restaurant=mongoose.model('Restaurant',RestaurantSchema);

export default Restaurant


