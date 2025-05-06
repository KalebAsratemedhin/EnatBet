import { isDeliveryPerson } from "../middlewares/auth.js";
import Delivery from "../models/delivery.js";
import Menu from "../models/Menu.js";
import Rating from "../models/Rating.js";
import Restaurant from "../models/Restaurant.js";


export const checkOwnership =(resourceOwnerId,currentUserId) =>{

    console.log(resourceOwnerId);
    return resourceOwnerId.toString() === currentUserId.toString();

}

export const checkWhoRates = (currentUserId, raterId) =>{

    return currentUserId.toString() === raterId.toString();

}
const calculateNewRating = (currentAvg, total, newRating, oldRating = null) =>{
  let newAverage;
  let newTotalRating =total;

  if (oldRating){

    newAverage = ((total * currentAvg)-oldRating + newRating) / (total + 1);

  }else{

    newAverage = ((total * currentAvg) + newRating) / (total + 1);
    newTotalRating = total+1
  }
 return { newAverage ,newTotalRating}

}

export const updateEntityRating = async (entityType, entityId, newRating,oldRating=null) => {
    try {
      if (entityType === "Restaurant") {
        const restaurant = await Restaurant.findById(entityId);
        if (!restaurant) {
          console.log("Restaurant not found");
          return;
        }
  
        const total = restaurant.totalRating ?? 0;
        const currentAvg = restaurant.rating ?? 0;
        
        const {newAverage, newTotalRating} = calculateNewRating(currentAvg,total,newRating,oldRating)

        await Restaurant.findByIdAndUpdate(entityId, {

          rating: newAverage,
          totalRating: newTotalRating,

        });
  
        console.log(`Updated Restaurant rating to ${newAverage}`);
      }
  
      else if (entityType === "MenuItem") {
        const menu = await Menu.findOne({ "menuItems._id": entityId });
  
        if (!menu) {
          console.log("Menu item not found");
          return;
        }
  
        const menuItem = menu.menuItems.id(entityId);
  
        if (!menuItem) {
          console.log("No such menu item");
          return;
        }
  
        const total = menuItem.totalRating ?? 0;
        const currentAvg = menuItem.rating ?? 0;
  
        const {newAverage, newTotalRating} = calculateNewRating(currentAvg,total,oldRating);

        menuItem.rating = newAverage;
        menuItem.totalRating = newTotalRating;
  
        await menu.save();
  
        console.log(`Updated MenuItem rating to ${newAverage}`);
      }else if (entityType === "Delivery_Person"){

        const deliveryPerson = Delivery.findById(entityId);

        if (!deliveryPerson) {
          console.log("Delivery person not found");
          return
        }

        const total = deliveryPerson.totalRating ?? 0;
        const currentAvg = deliveryPerson.rating ?? 0;

        const { newAverage, newTotalRating } = calculateNewRating(currentAvg, total, oldRating);

        await findByIdAndUpdate(entityId,{

          rating:newAverage,
          totalRating:newTotalRating

        });

      }
      else {

        console.log(" Unknown entity type");

      }
  
    } catch (error) {

      console.error(" Error updating entity rating:", error);
    }
  };