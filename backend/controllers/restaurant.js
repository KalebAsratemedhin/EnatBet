import Restaurant from '../models/Restaurant.js';
import { checkOwnership } from '../utils/index.js';
// import mongoose from 'mongoose';



export const addRestaurant = async (req,res) =>{
    
      try{
         const {name, latitude, longitude, address, deliveryAreaRadius} = req.body;
         const logo = req.file.path; 

         const newRestaurant = new Restaurant({
              ownerId:req.user.id,
              name,
              logo,
              location :{
                type:"Point",
                coordinates :[ latitude, longitude],
                address: address
              },
              deliveryAreaRadius
        
         })

         await newRestaurant.save();

         res.status(201).json({ message: "Restaurant created successfully", restaurant:newRestaurant});

      }catch(err){
        console.error("Error creating restaurant :",err);
        res.status(500).json({message:"Failed to create restaurant"});
      }

};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const currentUserId = req.user.id;  
    const restaurant = await Restaurant.findById(restaurantId).populate("ownerId");
    
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (!restaurant.ownerId) {
      return res.status(403).json({ message: "Restaurant has no owner assigned" });
    }

    if (!checkOwnership(restaurant.ownerId._id, currentUserId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, latitude, longitude, deliveryAreaRadius, address } = req.body;
    const logo = req?.file?.path

    const location = {
      type: "Point",
      coordinates: [longitude, latitude],  
      address: address
    };

    const updateData = {
      name,
      location,
      deliveryAreaRadius,
    };

    if (logo) {
      updateData.logo = logo;  
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, updateData, { new: true });

    return res.status(200).json(updatedRestaurant);  

  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};



export const deleteRestaurant = async (req,res) =>{

  try{  

      const restaurantId = req.params.id;
      const currentUserId = req.user.id;

      const restaurant = await Restaurant.findById(restaurantId);
      if(!checkOwnership(restaurant.ownerId, currentUserId)){

        return res.status(403).json({ message: "Not authorized to delete this comment" });
      
      }

      await Restaurant.findByIdAndDelete(restaurantId);

      res.status(200).json({message: "Restaurant deleted successfully"})

  }catch(err){

      res.status(500).json({message:err.message});

  }


}


export const getAllMineRestaurant = async (req,res) => {
   
      try{
        const userId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;

        const myRestaurants =await Restaurant.find({ownerId:userId})
            .skip(skip)
            .limit(limit);
        
        const total = await Restaurant.countDocuments({ownerId:userId});
        
        res.status(200).json({
            message: "Restaurants fetched successfully",
            data: myRestaurants,
            pagination: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            },
          });

      }catch (error) {
        res.status(500).json({ message: "Failed to fetch restaurants" });
      }
    };


export const getActiveRestaurants = async (req, res) => {
  try {

    console.log(" query ", req.query); 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const rating = parseFloat(req.query.rating);

    const filter = {
      status: "active",
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(rating && !isNaN(rating) && { rating: { $gte: rating } }),
    };
     
    const restaurants = await Restaurant.find(filter)
      .populate("ownerId", "name email phoneNumber")
      .skip(skip)
      .limit(limit);

    const totalCount = await Restaurant.countDocuments(filter);

    res.status(200).json({
      message: "Restaurants fetched successfully",
      data: restaurants,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching active restaurants", err: err.message });
  }
};
    

export const getAllRestaurant = async (req,res)=>{

    try{
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page-1)*limit;

      const allRestaurants = await Restaurant.find().populate("ownerId", "name email phoneNumber")
              .skip(skip)
              .limit(limit);

      const totalCount = await Restaurant.countDocuments();

      res.status(200).json({
          message: 'Restaurants fetched successfully',
          data: allRestaurants,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page
      });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch restaurants' });
    }
}


export const getRestaurantById = async (req,res) =>{
   
  try{
      const restaurantId = req.params.id;
      
      const restaurant = await Restaurant.findById(restaurantId).populate("menu");

      res.status(200).json({message:"Restaurant fetched successfully ", data: restaurant})


    }catch(err){
      res.status(500).json({message : err.message})
    }

}

export const updateRestaurantStatus = async (req,res) =>{
   
  try{
      const restaurantId = req.params.id;
      const {status} = req.body;
      
      const restaurant = await Restaurant.findById(restaurantId);

      console.log(" restaurant", restaurant);
      console.log(" status", status);
      
      

      restaurant.status = status; 

      restaurant.save();

      res.status(200).json({message:"Restaurant status updated successfully "})


    }catch(err){
      res.status(500).json({message : err.message})
    }

}