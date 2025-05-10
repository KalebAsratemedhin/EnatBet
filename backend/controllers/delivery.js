import Delivery from "../models/delivery.js";
import { deliveryService } from "../services/deliveryService.js";
import { checkOwnership } from "../utils/index.js";

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found." });
    }

    if (!checkOwnership(delivery.deliveryPersonId, req.user.id)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to update this order." });
    }

    delivery.status = status;
    delivery.save();

    if (status === "delivered" || status === "failed") {
      deliveryService.freeDeliveryPerson(delivery.deliveryPersonId);
    }

    res.status(200).json({ success: true, delivery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDeliveries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { deliveries, total } = await deliveryService.getAllDeliveries(
      page,
      limit
    );

    res.json({
      success: true,
      data: deliveries,
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

export const getCustomerDeliveries = async (req, res) => {
  try {
    const customerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    console.log("customerId", customerId);

    const { deliveries, total } = await deliveryService.getCustomerDeliveries(
      customerId,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      data: deliveries,
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

export const getDeliveryPersonDeliveries = async (req, res) => {
  try {
    const id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { deliveries, total } =
      await deliveryService.getDeliveryPersonDeliveries(id, page, limit);

    res.status(200).json({
      success: true,
      data: deliveries,
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
