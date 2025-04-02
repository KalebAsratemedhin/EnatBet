import mongoose, { mongo } from "mongoose";

const UserSchema=new mongoose.Schema({
    UserId:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true,index:true},
    Name:{type:String,required:true},
    Email:{type:String,required:true,unique:true,index:true,
         match: [/.+@.+\..+/, 'Please enter a valid email address'],},
    Password:{type:String,validate: {
        validator: function(value) {
            return this.googleId || (value && value.length > 0);
        },
        message: 'Password is required for non-Google users.'
    },required:true},
    Role:{type:String,enum:['customer','Restaurant_woner','delivery_person','admin'],required:true},
    PhoneNumber:{type:String, 
         match: [
        /^(?:(?:\+251|251|0)?9\d{8}|(?:\+251|251|0)?1[1-9]\d{6})$/,
        "Please enter a valid Ethiopian phone number"],required:true},
    Address:{type:String,required:true},
    
})
const User=mongoose.model('User','UserSchema')
export default User