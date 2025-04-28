import Rating from "../models/Rating.js";
import { updateEntityRating } from "../utils/index.js";

export const rate = async (req,res) => {

    try{

        const {rating} =req.body;
        const {entityType,entityId} = req.params;

        const currentUserId = req.user.id

        const isRated = await Rating.findOne({userId:currentUserId,entityId,entityType});

        if(isRated) return res.status(403).json({message:`You Aleady rated the ${entityType} `})

        const newRating = new Rating({

            entityType,
            entityId,
            rating,
            userId:currentUserId

        });

        await newRating.save();

        await updateEntityRating(entityType,entityId,rating,);

        res.status(201).json(newRating);

    }catch(err){

      console.error(err);

      res.status(500).json({err:"Server error"});
      
    }
}


export const updateRating = async (req,res) => {
    console.log("Received PUT request", req.params, req.body)

    const {entityType, entityId} = req.params;
    const { rating } = req.body;
    const currentUserId = req.user.id;

    try{
        const existingRating  = await Rating.findOne({ entityType, entityId,userId:currentUserId});
        console.log(existingRating);
        if(!existingRating) {
            return res.status(404).json({error: 'Rating not found.'});
        }

        if(rating<1 || rating > 5) {
            return res.status(400).json({error: 'Rating must be between 1 and 5.'});
        }
        
        const oldRating = existingRating.rating
        existingRating.rating = rating;
        
        await existingRating.save();

        await updateEntityRating(entityType,entityId,rating,oldRating);

        res.status(200).json(existingRating)

    } catch (error) {

        console.error(error);
        res.status(500).json({error: 'Server error'});
    }

}

export const getRatingForEntity = async (req,res) => {

    const {entityType,entityId} = req.params;

    try{
        const ratings = await Rating.find({entityType, entityId});

        if(!ratings.length) {
            return res.status(404).json({error: 'No ratings found for this entity.'})
        }
       
        const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

        res.status(200).json({ averageRating });

    }catch (err) {
        console.log(err);
        res.status(500).json({err:'Server error'})
    }

}