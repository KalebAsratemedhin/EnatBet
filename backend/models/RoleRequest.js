import mongoose from "mongoose";

const RoleRequestSchema = new mongoose.Schema({
      userId : {
      type : mongoose.Schema.Types.ObjectId,
       ref : 'User',
       required : true 
       },
       currentRoles : [{
        type : String,
        enum : ['customer', 'restaurant_owner', 'delivery_person', 'admin']
         }],
       additionalRole : {
        type : String,
        enum : ['restaurant_owner' , 'delivery_person', 'admin'],
        required : true
       },
       remark : {
        type : string,
        maxlength : 500
       }


})
 const RoleRequest = mongoose.model('RoleRequest',RoleRequestSchema);
 export default RoleRequest;