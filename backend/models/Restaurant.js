import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
    {
    ownerId : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    name : {
        type : String,
        required : true
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true
        },
        address: {
          type: String,
          required: true
        }
      },
    menu : 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Menu'
    },
    rating :
     {
        type : Number,
        min : 0,
        max : 5,
        default : 0
    },
    deliveryAreas : 
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


