import Menu from "../models/Menu.js";
import Rating from "../models/Rating.js";
import Restaurant from "../models/Restaurant.js";
import { ratingService } from "../services/ratingService.js";

export const rate = async (req, res) => {
  try {
    const { rating } = req.body;
    const { entityType, entityId } = req.params;

    const currentUserId = req.user.id;

    const existingRating = await Rating.findOne({
      userId: currentUserId,
      entityId,
      entityType,
    });

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }
    if (existingRating) {

      const oldRating = existingRating.rating;
      existingRating.rating = rating;

      await existingRating.save();

      await ratingService.updateEntityRating(
        entityType,
        entityId,
        rating,
        oldRating
      );

      return res.status(200).json(existingRating);
    }

    const newRating = new Rating({
      entityType,
      entityId,
      rating,
      userId: currentUserId,
    });

    await newRating.save();

    await ratingService.updateEntityRating(entityType, entityId, rating);

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getRatingForEntity = async (req, res) => {
  const { entityType, entityId } = req.params;
  const userId = req.user.id;

  try {
    const rating = await Rating.findOne({ entityType, entityId, userId });

    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ error, message: "Server error" });
  }
};


export const getTopRatedRestaurants = async (req, res) => {
  try {    
    const topRestaurants = await Restaurant.find({ status: "active" })
      .sort({ rating: -1 })
      .limit(10);

    res.status(200).json(topRestaurants);
  } catch (err) {
    console.error("Failed to get top-rated restaurants:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getTopRatedMenuItems = async (req, res) => {
  try {
    const topMenuItems = await Menu.aggregate([
      { $unwind: "$menuItems" },
      { $match: { "menuItems.rating": { $gt: 0 } } },
      { $sort: { "menuItems.rating": -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "restaurants", // collection name in MongoDB (usually lowercase plural)
          localField: "restaurant",
          foreignField: "_id",
          as: "restaurant"
        }
      },
      { $unwind: "$restaurant" },
      {
        $project: {
          _id: "$menuItems._id",
          name: "$menuItems.name",
          description: "$menuItems.description",
          price: "$menuItems.price",
          itemPicture: "$menuItems.itemPicture",
          rating: "$menuItems.rating",
          totalRating: "$menuItems.totalRating",
          menuId: "$_id",
          restaurant: "$restaurant"
        }
      }
    ]);

    res.status(200).json(topMenuItems);
  } catch (err) {
    console.error("Failed to get top-rated menu items:", err);
    res.status(500).json({ message: "Server Error" });
  }
};