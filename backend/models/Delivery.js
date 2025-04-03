import mongoose from "mongoose";

const DeliverySchema=new mongoose.Schema({
    deliveryId:{type:mongoose.Schema.Types.ObjectId,required:true ,unique:true ,index:true},
    orderID: {type: mongoose.Schema.Types.ObjectId,ref: 'Order',required: true,index:true},
    deliveryPersonID: {type: Schema.Types.ObjectId,ref: 'User',required: true},
    status: {type: String,enum: ['unassigned','assigned','picked_up','on_the_way','delivered','failed'],default: 'unassigned'},
    estimatedDeliveryTime: {
        type: Date
      },

})
const Delivery=mongoose.model("Delivery",DeliverySchema);
export default Delivery;