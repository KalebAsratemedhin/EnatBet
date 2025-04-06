import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema({
    userId : {

        type : mongoose.Schema.Types.ObjectId,
        required : false,
        unique : true,
        index : true,
    },

    name : {

        type : String,
        required : true,
        trim : true,
        maxlength : [50, "Name cannot exceed 50 characters"]
    },

    email : {

        type : String,
        required : true,
        unique : true,
        index : true,
         match : [/.+@.+\..+/, 'Please enter a valid email address'],},

    password : {

        type : String,
        validate : {
        validator : function(value) 
        {
            return this.googleId || (value && value.length > 0);
        },
        message: 'Password is required for non-Google users.'
       }
      },

    role : {

        type : [String],
        enum : ['Admin','customer','restaurant_owner','Delivery_person'],
        default:['Admin']
     },

    phoneNumber : {

        type : String, 
        match: [
        /^(?:(?:\+251|251|0)?9\d{8}|(?:\+251|251|0)?1[1-9]\d{6})$/,
        "Please enter a valid Ethiopian phone number"],
        required:true },

    address : {
        type : String,
        required : true},

    isEmailVerified : {
        type : Boolean,
        default : false
    },

    isPhoneVerified : {

        type : Boolean,
        default : false
    }
    
})
const User=mongoose.model('User',UserSchema);

export default User;
        // default:"customer"
