import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
    {
    RestaurantId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        unique : true ,
        index:true},
    ownerId : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    Name : {
        type : String,
        required : true
    },
    Locaton : 
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
    Menu : 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Menu'
    },
    Rating :
     {
        type : number,
        min : 0,
        max : 5,
        default : 0
    },
    DeliverAreas : 
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


