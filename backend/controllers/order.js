import Order from "../models/order.js";
import Restaurant from "../models/Restaurant.js";
import OrderService from "../services/orderService.js";
import { checkOwnership } from "../utils/index.js";

export const createOrder = async (req, res) => {
  try {

    console.log("order data ", req.body);
    
    const orderData = {
      ...req.body,
      customerID: req.user.id, 
    };

    if (!orderData.restaurantID ){
        return res.status(400).json({message: "No restaurant provided."})
    }

    const restaurant = await Restaurant.findById(orderData.restaurantID)
    if(!restaurant){
        return res.status(400).json({message: "No restaurant provided."})
    }


    if(restaurant.status !== "active"){
        return res.status(400).json({message: "Restaurant is not active."})
    }
    
    const newOrder = await OrderService.createOrder(orderData);
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const oldOrder = await OrderService.getOrderById(id);
    let order;

    if(!checkOwnership(oldOrder.restaurantID.owner, req.user.id)){
        return res.status(401).json({message: "You are not authorized to update this order."})
    }

    if(oldOrder.status === "cancelled"){
        return res.status(401).json({message: "Order is cancelled by the customer."})
    }

    if(status === "preparing"){
       order = await OrderService.prepareOrder(id);
    } else if(status === "ready"){
        order = await OrderService.completeOrder(id);
    } else {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { orders, total } = await OrderService.getOrders(page, limit);

    res.json({ success: true, 
      data: orders, 
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }});

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { orders, total } = await OrderService.getOrdersByCustomerID(customerId, page, limit);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getRestaurantOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { orders, total } = await OrderService.getOrdersByRestaurantID(id, page, limit);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const oldOrder = await OrderService.getOrderById(id);

        if(!checkOwnership(oldOrder.customerID, req.user.id)){
            return res.status(401).json({message: "You are not authorized to update this order."})
        }

        const order = await OrderService.getOrderById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        if (order.status === "cancelled") {
            return res.status(400).json({ success: false, message: "Order already cancelled." });
        }
        if (order.status === "ready" || order.status === "preparing") {
            return res.status(400).json({ success: false, message: "Order is past pending state and cannot be cancelled." });
        }
        const cancelledOrder = await OrderService.cancelOrder(id);
    
        if (!cancelledOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
        }
    
        res.status(200).json({ success: true, order: cancelledOrder });
    } catch (error) {
      console.error("Error cancelling order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

