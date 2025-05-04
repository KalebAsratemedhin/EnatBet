import mongoose from "mongoose";
import {MenuItemsSchema} from "./Menu.js";

const { Schema } = mongoose;

const OrderSchema = new Schema(
  { 
    customerID: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    restaurantID: { 
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true
    },
    orderDetails: [
      {
        item: {
          type: MenuItemsSchema,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    status: {
      type: String,
      enum: [
        'pending',  
        'preparing', 
        'ready',
        'cancelled'
      ],
      default: 'pending'
    },
    totalAmount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ['telebirr', 'cbe'],
      required: true
    },
    deliveryAddress: {
      type: String,
      required: true
    },
    coordinates : {
      type: {
        lat: Number,
        lng: Number
      },
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const Order = mongoose.model('Order', OrderSchema);
export default Order;
