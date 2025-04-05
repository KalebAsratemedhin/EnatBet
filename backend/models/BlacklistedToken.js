import mongoose from "mongoose";

const BlackedListSchema = new mongoose.Schema(
    {
        token :{type: String,
        required : true,
        uinque : true,
    },

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : false

    },

    

  

}
);

BlackedListSchema.index({token:1 });

const BlacklistedToken = mongoose.model('BlacklistedToken',BlackedListSchema);

export default BlacklistedToken
