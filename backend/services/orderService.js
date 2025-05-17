import Order from "../models/order.js";
import Restaurant from "../models/Restaurant.js";

class OrderService {
  static async createOrder(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }

  static async getOrderById(orderId) {
    return await Order.findById(orderId).populate("restaurantID");
  }

  static async getOrders(filter = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .skip(skip)
        .limit(limit)
        .populate("customerID")
        .populate("restaurantID")
        .exec(),
      Order.countDocuments(filter)
    ]);
    return { orders, total };
  }

  static async getOrdersByCustomerID(customerId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
  
    const [orders, total] = await Promise.all([
      Order.find({ customerID: customerId })
        .populate("restaurantID")
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ customerID: customerId }),
    ]);
  
    return { orders, total };
  }
  
  static async getOrdersByRestaurantID(restaurantID, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
  
    const [orders, total] = await Promise.all([
      Order.find({ restaurantID })
        .populate("customerID")
        .populate("restaurantID")
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ restaurantID }),
    ]);
  
    return { orders, total };
  }  

  static async updateOrderStatus(orderId, status) {
    return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  }

  static async cancelOrder(orderId) {
    return await this.updateOrderStatus(orderId, "cancelled");
  }

  static async completeOrder(orderId) {
    return await this.updateOrderStatus(orderId, "ready");
  }

  static async prepareOrder(orderId) {
    return await this.updateOrderStatus(orderId, "preparing");
  }

  static async deleteOrder(orderId) {
    return await Order.findByIdAndDelete(orderId);
  }
}

export default OrderService;
