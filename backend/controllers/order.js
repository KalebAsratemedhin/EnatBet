import Order from "../models/order.js";
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";
import User from "../models/user.js";
import { deliveryService } from "../services/deliveryService.js";
import OrderService from "../services/orderService.js";
import { checkOwnership } from "../utils/index.js";
import NotificationService from "../services/notificationService.js";

export const createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      customerID: req.user.id,
    };
    const user = await User.findById(req.user.id);

    if (!orderData.restaurantID) {
      return res.status(400).json({ message: "No restaurant provided." });
    }

    const restaurant = await Restaurant.findById(orderData.restaurantID);
    if (!restaurant) {
      return res.status(400).json({ message: "No restaurant provided." });
    }

    if (restaurant.status !== "active") {
      return res.status(400).json({ message: "Restaurant is not active." });
    }

    const newOrder = await OrderService.createOrder(orderData);
    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    console.log(" update order status ", req.body, req.params);
    const io = req.app.get("io");
    const { id } = req.params;
    const { status } = req.body;

    const oldOrder = await OrderService.getOrderById(id);
    let order;

    console.log("old order ", oldOrder);

    if (!checkOwnership(oldOrder.restaurantID.ownerId, req.user.id)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to update this order." });
    }

    if (oldOrder.status === "cancelled") {
      return res
        .status(401)
        .json({ message: "Order is cancelled by the customer." });
    }

    if (status === "preparing") {
      order = await OrderService.prepareOrder(id);
      await NotificationService.createNotification(io, oldOrder.customerID, "Your order is  being prepared")
    } else if (status === "ready") {
      order = await OrderService.completeOrder(id);
      await deliveryService.assignDelivery(id);
      await NotificationService.createNotification(io, oldOrder.customerID, "Your order is  ready for delivery and has been assigned to delivery")

    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { orders, total } = await OrderService.getOrders(page, limit);

    res.json({
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

export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { orders, total } = await OrderService.getOrdersByCustomerID(
      customerId,
      page,
      limit
    );

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
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRestaurantOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { orders, total } = await OrderService.getOrdersByRestaurantID(
      id,
      page,
      limit
    );
    console.log(" orders ", orders);

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
    console.error("Error fetching rest orders:", error);

    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
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

    if (!checkOwnership(oldOrder.customerID, req.user.id)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to update this order." });
    }

    const order = await OrderService.getOrderById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    if (order.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Order already cancelled." });
    }
    if (order.status === "ready" || order.status === "preparing") {
      return res.status(400).json({
        success: false,
        message: "Order is past pending state and cannot be cancelled.",
      });
    }
    const cancelledOrder = await OrderService.cancelOrder(id);

    if (!cancelledOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order: cancelledOrder });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const payForOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { total, orderId } = req.body;
    const order = await OrderService.getOrderById(orderId);

    const token = jwt.sign({ orderId: order._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    const returnUrl = `${process.env.SERVER_URL}/order/payment-success?token=${token}`; // Adjust port & path as needed

    var myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${process.env.CHAPA_AUTH}`);

    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      amount: total,

      currency: "ETB",

      email: user.email,

      first_name: user.name,

      phone_number: user.phoneNumber,
      tx_ref: `order_${order._id}`,
      return_url: returnUrl,
      "customization[title]": "Order payment",
      "meta[hide_receipt]": "true",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log("request options ", requestOptions);

    fetch("https://api.chapa.co/v1/transaction/initialize", requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        console.log("result ", result);
        if (result.status === "failed") {
          return res.status(400).json({ message: result.message });
        }
        return res
          .status(201)
          .json({ message: result.message, url: result.data.checkout_url });
      })
      .catch((error) => {
        console.log("error ", error);
        return res.status(400).json({ message: error.message });
      });
  } catch (error) {
    console.error("error ", error);
    return res.status(500).json({ message: error.message });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const { token } = req.query;

    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { orderId } = decoded;

    // Update the order status to "pending"
    await OrderService.updateOrderStatus(orderId, "pending");

    return res.redirect(
      `${process.env.CLIENT_URL}/order-confirmation/${orderId}`
    );
  } catch (error) {
    console.error("error ", error);
    return res.status(500).json({ message: error.message });
  }
};
