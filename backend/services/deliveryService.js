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
          match: { customerID: customerId }, // Filters orders by customer
          populate: [
            { path: "customerID", select: ["name", "phoneNumber"] },
            { path: "restaurantID", select: "name" },
          ],
        })
        .populate({
          path: "deliveryPersonId",
          populate: [
            {
              path: "userId",
              select: ["name", "phoneNumber", "profileImage"],
            },
          ],
          select: ["rating"],
        }) // Avoids strict population errors
        .skip(skip)
        .limit(limit)
        .lean(), // Optional: convert Mongoose docs to plain objects
      Delivery.countDocuments().populate({
        path: "orderId",
        match: { customerID: customerId },
      }),
    ]);

    console.log("Deliveries:", deliveries, deliveries[0].deliveryPersonId);

    // Filter out any deliveries where the orderId was null due to the match
    const filteredDeliveries = deliveries.filter((d) => d.orderId);

    return { deliveries: filteredDeliveries, total: filteredDeliveries.length };
  }

  async findDeliveryPerson() {
    const freePerson = await DeliveryPerson.findOne({
      status: "free",
    }).populate("userId");
    if (freePerson) {
      return freePerson.userId;
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
          localField: "deliveryPersonID",
          foreignField: "userId",
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
          _id: "$deliveryPersonID",
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
      const deliveryPersonUserId = deliveries[0]._id;
      const person = await DeliveryPerson.findOne({
        userId: deliveryPersonUserId,
      }).populate("userId");
      return person.userId;
    }

    throw new Error("No delivery person available at the moment.");
  }

  async assignDelivery(orderId) {
    console.log("Assigning delivery for order:", orderId);

    const deliveryPerson = await this.findDeliveryPerson();

    console.log("Found delivery person:", deliveryPerson);

    const assignment = await Delivery.create({
      deliveryPersonId: deliveryPerson._id,
      orderId,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
    });

    if (deliveryPerson.status === "free") {
      await DeliveryPerson.updateOne(
        { userId: deliveryPerson._id },
        { status: "busy" }
      );
    }

    return assignment;
  }

  async freeDeliveryPerson(deliveryPersonId) {
    const pendingAssignments = await Delivery.countDocuments({
      deliveryPersonId: deliveryPersonId,
      status: "assigned" | "on_the_way",
    }).sort({ assignedAt: 1 });

    const deliveryPerson = await User.findById(deliveryPersonId);

    if (pendingAssignments == 0) {
      deliveryPerson.status = "free";
      await deliveryPerson.save();
    }
  }
}

export const deliveryService = new DeliveryService();
