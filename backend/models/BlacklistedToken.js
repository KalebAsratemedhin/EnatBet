import mongoose from "mongoose";

const BlackedListSchema = new mongoose.Schema(
    {
        token :{type: String,
        required : true,
        uinque : true 
    },

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true

    },

    reason : {
        type : String,
        enum : ['logout', 'password_reset','security_alert'],
        default : 'logout'
    },

    createdAt :{
        type: Date,
        default:Date.now,
        expires:'7d' 
    }

}
);

BlackedListSchema.index({token: 1, userId: 1 });

const BlacklistedToken = mongoose.model('BlacklistedToken',BlackedListSchema);

export default BlacklistedToken
