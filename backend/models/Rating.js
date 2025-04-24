import mongoose from "mongoose";

const RatingSchema = mongoose.Schema({

    entityType:{

        type:String,
        enum:["Restaurant","MenuItem","Delivery_Person"],
        required:true

    },

    entityId: {

        type:Types.ObjectId,
        required:true,
        refPath:"entityType"

    },

    userId: {

        type:Types.ObjectId,
        required:true,
        ref:"User"

    },

    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    }


},
{timestamps:true});
RatingSchema.index({entityType:1, entityId:1})

const Rating = mongoose.model("Rating", RatingSchema);

export default Rating