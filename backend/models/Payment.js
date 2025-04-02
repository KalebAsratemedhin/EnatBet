import mongoose from "mongoose";

const PaymentSchema=new mongoose.Schema({
    PaymentId:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true, index:true},
    orderID: {type: mongoose.Schema.Types.ObjectId,ref: 'Order',required: true, index:true },
    amount: {type: Number,required: true},
    paymentMethod: {type: String,enum: ['telebirr','cbe-birr'],required: true},
    status: {type: String,enum: ['pending', 'completed', 'failed', 'refunded'],default: 'pending'},
    paymentDate: {type: Date,default: Date.now}
});

const Payment = mongoose.model('Payment',PaymentSchema);
export default Payment;