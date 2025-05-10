import { isDeliveryPerson } from "../middlewares/auth.js";
import Delivery from "../models/delivery.js";
import Menu from "../models/Menu.js";
import Rating from "../models/Rating.js";
import Restaurant from "../models/Restaurant.js";


export const checkOwnership =(resourceOwnerId,currentUserId) =>{

    console.log(resourceOwnerId);
    return resourceOwnerId.toString() === currentUserId.toString();

}
