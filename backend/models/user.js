import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  profileImage: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },

  password: {
    type: String,
    validate: {
      validator: function (value) {
        return this.googleId || (value && value.length > 0);
      },
      message: "Password is required for non-Google users.",
    },
  },
  emailVerificationOTP: { type: String },
  otpExpires: { type: Date },
  role: {
    type: String,
    enum: ["admin", "customer", "restaurant_owner", "delivery_person"],
    default: "customer",
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  phoneNumber: {
    type: String,
    match: [
      /^(?:(?:\+251|251|0)?9\d{8}|(?:\+251|251|0)?1[1-9]\d{6})$/,
      "Please enter a valid Ethiopian phone number",
    ],
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
});
const User = mongoose.model("User", UserSchema);

export default User;
