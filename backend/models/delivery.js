import mongoose from "mongoose";
import { Schema } from "mongoose";
const DeliverySchema=new mongoose.Schema({
    deliveryId:{type:mongoose.Schema.Types.ObjectId,required:true ,unique:true ,index:true},
    orderID: {type: mongoose.Schema.Types.ObjectId,ref: 'Order',required: true,index:true},

    deliveryPersonID: {type: Schema.Types.ObjectId,ref: 'User',required: true},

    status: {type: String,enum: ['unassigned','assigned','picked_up','on_the_way','delivered','failed'],default: 'unassigned'},
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
    estimatedDeliveryTime: {
        type: Date
      },

})
const Delivery=mongoose.model("Delivery",DeliverySchema);
export default Delivery;