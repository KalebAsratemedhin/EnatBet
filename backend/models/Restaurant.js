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
          required: false,
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
    [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Menu'
    }],
    rating :
     {
        type : Number,
        min : 0,
        max : 5,
        default : 0
    },
    
    totalRating :{
      type: Number,
      default :0
    },
    deliveryAreaRadius : 
    {
      type:Number
    },
    logo: { 
      type: String
    },
    status: {type: String,enum: ['pending', 'active', 'inactive'],default: 'pending'},


})

RestaurantSchema.index({Location:"2dsphere"});

const Restaurant=mongoose.model('Restaurant',RestaurantSchema);

export default Restaurant


