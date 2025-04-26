import { User } from "./models/User.js";
import Delivery from "../models/Delivery.js";

class DeliveryService {
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
    const deliveryPerson = await this.findDeliveryPerson();

    const assignment = await Delivery.create({
      deliveryPersonId: deliveryPerson.userId,
      orderId,
    });

    if (deliveryPerson.status === "free") {
      deliveryPerson.status = "busy";
      await deliveryPerson.save();
    }

    return assignment;
  }

  async markDelivered(orderId) {
    const assignment = await Delivery.findOne({ orderId });

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    assignment.status = "delivered";
    await assignment.save();

    const pendingAssignments = await Delivery.countDocuments({
      deliveryPersonId: assignment.deliveryPersonId,
      status: "assigned" | "on_the_way",
    }).sort({ assignedAt: 1 });

    const deliveryPerson = await User.findById(assignment.deliveryPersonId);

    if (pendingAssignments == 0) {
      deliveryPerson.status = "free";
      await deliveryPerson.save();
    }

    return { message: "Delivery marked as completed" };
  }
}

export const deliveryService = new DeliveryService();
