import Restaurant from "../models/Restaurant.js";
import Menu from "../models/Menu.js";
import Delivery from "../models/delivery.js";
import mongoose from "mongoose";
import DeliveryPerson from "../models/deliveryPerson.js";

class RatingService {
  checkWhoRates(currentUserId, raterId) {
    return currentUserId.toString() === raterId.toString();
  }

  calculateNewRating(currentAvg, total, newRating, oldRating = null) {
    let newAverage;
    let newTotalRating = total;

    if (oldRating && total > 0) {
      newAverage = (total * currentAvg - oldRating + newRating) / total;
    } else {
      newAverage = (total * currentAvg + newRating) / (total + 1);
      newTotalRating = total + 1;
    }

    return { newAverage, newTotalRating };
  }

  async updateEntityRating(entityType, entityId, newRating, oldRating = null) {
    if (entityType === "Restaurant") {
      this.updateRestaurantRating(
        new mongoose.Types.ObjectId(entityId),
        newRating,
        oldRating
      );
    } else if (entityType === "MenuItem") {
      this.updateMenuItemRating(entityId, newRating, oldRating);
    } else if (entityType === "Delivery_Person") {
      this.updateDeliveryPersonRating(
        new mongoose.Types.ObjectId(entityId),
        newRating,
        oldRating
      );
    }
  }

  async updateRestaurantRating(restaurantId, newRating, oldRating) {
    const restaurant = await Restaurant.findById(restaurantId);

    const rating = restaurant.rating ?? 0;
    const totalRating = restaurant.totalRating ?? 0;

    const { newAverage, newTotalRating } = this.calculateNewRating(
      rating,
      totalRating,
      newRating,
      oldRating
    );

    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: newAverage,
      totalRating: newTotalRating,
    });
  }

  async updateMenuItemRating(menuItemId, newRating, oldRating) {
    const [itemId, menuId] = menuItemId.split(",");
    const menu = await Menu.findOne({
      _id: new mongoose.Types.ObjectId(menuId),
    });

    if (!menu) {
      return;
    }

    const menuItem = menu.menuItems.id(itemId);
    if (!menuItem) {
      return;
    }

    const rating = menuItem.rating ?? 0;
    const totalRating = menuItem.totalRating ?? 0;

    const { newAverage, newTotalRating } = this.calculateNewRating(
      rating,
      totalRating,
      newRating,
      oldRating
    );

    menuItem.rating = newAverage;
    menuItem.totalRating = newTotalRating;

    await menu.save();
  }

  async updateDeliveryPersonRating(deliveryPersonId, newRating, oldRating) {
    console.log(deliveryPersonId, "delivery personId");

    const deliveryPerson = await DeliveryPerson.findById(deliveryPersonId);
    if (!deliveryPerson) {
      console.log("Delivery person not found");
      return;
    }

    const rating = deliveryPerson.rating ?? 0;
    const totalRating = deliveryPerson.totalRating ?? 0;

    const { newAverage, newTotalRating } = this.calculateNewRating(
      rating,
      totalRating,
      newRating,
      oldRating
    );

    await DeliveryPerson.findByIdAndUpdate(deliveryPersonId, {
      rating: newAverage,
      totalRating: newTotalRating,
    });
  }
}

export const ratingService = new RatingService();
