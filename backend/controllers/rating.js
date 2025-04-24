import Rating from "../models/Rating";
import { checkWhoRates, updateEntityRating } from "../utils";

export const rate = async (req,res) => {

    try{

        const {rating} =req.body;

        const {entityType,entityId} = req.params;

        const currentUserId = req.user.id

        const newRating = new Rating({

            entityType,
            entityId,
            rating,
            userId:currentUserId

        });

        await newRating.save();

        await updateEntityRating(entityType,entityId);

        res.status(201).json(newRating);

    }catch(err){

      console.error(err);

      res.status(500).json({err:"Server error"});
      
    }
}


export const updateRating = async (req,res) => {

    const {entityType, entityId} = req.params;
    const { rating } = req.body;
    const currentUserId = req.user.id;

    try{
        const existingRating  = await Rating.findOne({ entityType, entityId,userId});

        if(!existingRating) {
            return res.status(404).json({error: 'Rating not found.'});
        }

        if(rating<1 || rating > 5) {
            return res.status(400).json({error: 'Rating must be between 1 and 5.'});
        }
        //check the rater is current user 
        if(!checkWhoRates(currentUserId, entityId)) return res.status(403).json({message: "Unauthorized"});

        existingRating.rating = rating;
        
        await existingRating.save();

        await updateEntityRating(entityType,entityId);

        res.status(200).json(existingRating)

    } catch (error) {

        console.error(error);
        res.status(500).json({error: 'Server error'});
    }

}

export const getRatingForEntity = async (req,re) => {

    const {entityType,entityId} = req.params;

    try{
        const ratings = await Rating.find({entityType, entityId});

        if(!ratings.length) {
            return res.status(404).json({error: 'No ratings found for this entity.'})
        }

        const totalRating = ratings.reduce((sum,rating) =>sum + rating + rating.rating,0);
        const averageRating = totalRating / ratings.length;

        res.status(200).json({ averageRating });

    }catch (err) {
        console.log(err);
        res.status(500).json({err:'Server error'})
    }

}