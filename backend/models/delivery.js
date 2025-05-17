import mongoose from "mongoose";
import { Schema } from "mongoose";

const DeliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
    unique: true,
  },
  deliveryPersonId: {
    type: Schema.Types.ObjectId,
    ref: "DeliveryPerson",
    required: true,
  },

  status: {
    type: String,
    enum: ["assigned", "picked_up", "on_the_way", "delivered", "failed"],
    default: "assigned",
  },
  estimatedDeliveryTime: {
    type: Date,
  }
});
const Delivery = mongoose.model("Delivery", DeliverySchema);
export default Delivery;
