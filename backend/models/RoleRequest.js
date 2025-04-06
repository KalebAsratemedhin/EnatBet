import mongoose from "mongoose";

const RoleRequestSchema = new mongoose.Schema({
      userId : {
      type : mongoose.Schema.Types.ObjectId,
       ref : 'User',
       required : true 
       },
       requestedRole : {
        type : [String],
        enum : ['restaurant_owner' , 'Delivery_person', 'Admin','customer'],
        required : true
       },
       status : { type : String ,enum :['pending','approved', 'disaproved','cancelled'],default:'pending'},

       remark : {
        type : String,
        maxlength : 500
       }


})
// RoleRequestSchema.index({ userId: 1, status: 1 });
const RoleRequest = mongoose.model('RoleRequest',RoleRequestSchema);
export default RoleRequest;