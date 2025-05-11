import User from "../models/user.js";
import Delivery from "../models/delivery.js";
import DeliveryPerson from "../models/deliveryPerson.js";
import mongoose from "mongoose";

class DeliveryService {
  static async getDeliveryById(deliveryId) {
    return await Delivery.findById(deliveryId);
  }

  async getAllDeliveries(page, limit) {
    const deliveries = await Delivery.find()
      .populate("deliveryPersonId")
      .populate("orderId")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Delivery.countDocuments();

    return { deliveries, total };
  }

  async getDeliveryPersonDeliveries(deliveryPerson, page, limit) {
    const deliveries = await Delivery.find({ deliveryPersonId: deliveryPerson })
      .populate({
        path: "orderId",
        populate: [
          { path: "customerID", select: ["name", "phoneNumber"] },
          { path: "restaurantID", select: "name" },
        ],
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Delivery.countDocuments({
      deliveryPersonId: deliveryPerson,
    });

    return { deliveries, total };
  }

  async getCustomerDeliveries(customerId, page, limit) {
    const skip = (page - 1) * limit;

    const [deliveries, total] = await Promise.all([
      Delivery.find()
        .populate({
          path: "orderId",
          match: { customerID: customerId },
          populate: [
            { path: "customerID", select: ["name", "phoneNumber"] },
            { path: "restaurantID", select: "name" },
          ],
        })
        .populate({
          path: "deliveryPersonId",
          select: "rating",
          populate: {
            path: "userId",
            select: ["name", "phoneNumber", "profileImage"],
          },
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Delivery.countDocuments().populate({
        path: "orderId",
        match: { customerID: customerId },
      }),
    ]);

    console.log("Deliveries:", deliveries[0].deliveryPersonId);

    // Filter out any deliveries where the orderId was null due to the match
    const filteredDeliveries = deliveries.filter((d) => d.orderId);

    return { deliveries: filteredDeliveries, total: filteredDeliveries.length };
  }

  async findDeliveryPerson() {
    const freePerson = await DeliveryPerson.findOne({
      status: "free",
    }).populate("userId");
    if (freePerson) {
      return freePerson._id;
    }

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const deliveries = await Delivery.aggregate([
      {
        $match: {
          status: { $in: ["assigned", "on_the_way"] },
          estimatedDeliveryTime: { $gte: now },
        },
      },
      {
        $lookup: {
          from: "deliverypeople",
          localField: "deliveryPersonId",
          foreignField: "_id",
          as: "deliveryPerson",
        },
      },
      { $unwind: "$deliveryPerson" },
      {
        $match: {
          "deliveryPerson.status": { $in: ["busy", "unavailable"] },
        },
      },
      {
        $group: {
          _id: "$deliveryPersonId",
          earliestDeliveryTime: { $min: "$estimatedDeliveryTime" },
          deliveriesToday: {
            $sum: {
              $cond: [{ $gte: ["$estimatedDeliveryTime", todayStart] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: {
          earliestDeliveryTime: 1,
          deliveriesToday: 1,
        },
      },
      { $limit: 1 },
    ]);

    if (deliveries.length > 0) {
      console.log("find delv person delvs ", deliveries);

      return deliveries[0]._id;
    }

    throw new Error("No delivery person available at the moment.");
  }

  async assignDelivery(orderId) {
    console.log("Assigning delivery for order:", orderId);

    const deliveryPerson = await this.findDeliveryPerson();

    console.log("Found delivery person:", deliveryPerson);

    const assignment = await Delivery.create({
      deliveryPersonId: deliveryPerson,
      orderId,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
    });

    const deliverer = await DeliveryPerson.findById(deliveryPerson);
    if (deliverer && deliverer.status === "free") {
      deliverer.status = "busy";
      await deliverer.save();
    }

    return assignment;
  }

  async freeDeliveryPerson(deliveryPersonId) {
    const pendingAssignments = await Delivery.countDocuments({
      deliveryPersonId: deliveryPersonId,
      status: "assigned" | "picked_up",
    }).sort({ assignedAt: 1 });

    const deliveryPerson = await DeliveryPerson.findById(deliveryPersonId);

    if (pendingAssignments == 0) {
      deliveryPerson.status = "free";
      await deliveryPerson.save();
    }
  }
}

export const deliveryService = new DeliveryService();
