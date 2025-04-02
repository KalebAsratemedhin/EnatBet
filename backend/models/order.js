import mongoose from "mongoose";

const OrderSchema=new mongoose.Schema(
    
    { OrderId:{type:mongoose.Schema.Types.ObjectId,reuired:true,index:true},
      customerID: {type: mongoose.Schema.Types.ObjectId,ref: 'Customer',required: true,index:true},
      restaurantID: {type: Schema.Types.ObjectId,ref: 'Restaurant',required: true,index:true},
      orderDetails: [{itemID: Schema.Types.ObjectId,name: String,quantity: Number,price: Number}],
      status: {type: String,enum: ['pending', 'confirmed', 'preparing', 'ready_for_delivery', 'on_the_way', 'delivered', 'cancelled'], default:'pending'},
      totalAmount: {type: Number,required: true},
      paymentMethod: {type: String,enum: ['telebirr','cbe-birr',],required: true},
      deliveryAddress: {type: String,required: true},
      createdAt: {type: Date,default: Date.now}
 
    }
);
const Order = mongoose.model('Order',OrderSchema);
export default Order



