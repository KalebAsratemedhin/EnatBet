import mongoose from "mongoose";

export const CustomerSchema =new mongoose.Schema({

 CustomerId:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true,index:true},
 UserId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,unique:true,index:true},
 PaymentMethods:[{type:String,enum:['telebirr','cbe_birr'],required:true}],
 orderHistory:[{type:mongoose.Schema.Types.ObjectId, ref: 'order'}],
 Customer:{type:String,required:false}
});
const Customer=mongoose.model('Customer',CustomerSchema);
export default Customer;