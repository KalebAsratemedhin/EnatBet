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
    deliveryAreas : 
    {
      type:Number
    },
    logo: { 
      type: String
    },
    status: {type: String,enum: ['pending', 'approved', 'disapproved', 'inactive'],default: 'pending'},


})

RestaurantSchema.index({Location:"2dsphere"});

const Restaurant=mongoose.model('Restaurant',RestaurantSchema);

export default Restaurant


