import mongoose from "mongoose";

export const CustomerSchema =new mongoose.Schema({

 customerId:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true,index:true},
 userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,unique:true,index:true},
 paymentMethods:[{type:String,enum:['telebirr','cbe_birr'],required:true}],
 orderHistory:[{type:mongoose.Schema.Types.ObjectId, ref: 'order'}],
 

});

const Customer=mongoose.model('Customer',CustomerSchema);
export default Customer;