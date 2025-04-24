import { isDeliveryPerson } from "../middlewares/auth";
import Menu from "../models/Menu";
import Rating from "../models/Rating";
import Restaurant from "../models/Restaurant";


export const checkOwnership =(resourceOwnerId,currentUserId) =>{

    console.log(resourceOwnerId);
    return resourceOwnerId.toString() === currentUserId.toString();

}

export const checkWhoRates = (currentUserId, raterId) =>{

    return currentUserId.toString() === raterId.toString();
    
}

export const updateEntityRating = async (entityType, entityId) => {
    try {
        const ratings = await Rating.find({ entityType, entityId });

        if (ratings.length === 0) {

            console.log("No ratings found for this entity.");
            return;
        }

        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / ratings.length;

        if (entityType === 'Restaurant') {

            await Restaurant.findByIdAndUpdate(entityId, { rating: averageRating });

            console.log(` Updated Restaurant rating to ${averageRating}`);
        } 

        else if (entityType === 'MenuItem') {
            await Menu.updateOne(

                { "menuItems._id": entityId },
                { $set: { "menuItems.$.rating": averageRating } 
            
            }
            );

            console.log(` Updated MenuItem rating to ${averageRating}`);

        } 
        else if(entityType === "Delivery_Person"){

            await DeliveryPerson.findByIdAndUpdate(entityId, {rating:averageRating});

            console.log(`Updated menu item rating to ${averageRating}`);


        }
        else {

            console.log(` Unknown entity type: ${entityType}`);

        }
    } catch (err) {

        console.error(" Error updating entity rating:", err);

    }
};