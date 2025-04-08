import express from 'express';
import Restaurant from '../models/Restaurant.js';
import { checkOwnership } from '../utils/index.js';
// import mongoose from 'mongoose';



export const addRestaurant = async (req,res) =>{
    
      try{
         const {name, location,deliveryAreas,promotion,} = req.body;

         const newRestaurant = new Restaurant({
             ownerId:req.user.id,
              name,
              location :{
                type:"Point",
                coordinates :location.coordinates,
                address:location.address
              },
              deliveryAreas,
              promotion
        
         })

         await newRestaurant.save();

         res.status(201).json({ message: "Restaurant created successfully", restaurant:newRestaurant});

      }catch(err){
        console.error("Error creating restaurant :",err);
        res.status(500).json({message:"Failed to create restaurant"});
      }

};



export const updateRestaurant = async (req,res) =>{

      try{
        const restaurantId = req.params.id;
        const currentUserId =req.user.id;

        const restaurant = await Restaurant.findById(restaurantId).populate("ownerId");
        if (!restaurant.ownerId) {
          return res.status(403).json({ message: "Restaurant has no owner assigned" });
        }
        if(!restaurant){

           return res.status(404).json({message: "Restaurant not found"});

        }
        console.log(restaurant.ownerId)
        if(!checkOwnership(restaurant.ownerId._id,currentUserId)){

            return res.status(403).json({message:"Unauthorized"});

        }

        const {name, location, deliveryAreas,promotion} =req.body
        const result = await Restaurant.findByIdAndUpdate(restaurantId,{
           name:name,
           location:location,
           deliveryAreas :deliveryAreas,
           promotion:promotion

        });

        return res.status(201).json(result);

      }catch(err){

         res.status(500).send({message:err.message});

      }


}


export const deleteRestaurant = async (req,res) =>{

           try{

               const restaurantId = req.params.id;
               const currentUserId = req.user.id;

               const restaurant = await Restaurant.findById(restaurantId);
               console.log(restaurant)
               if(!checkOwnership(restaurant.ownerId, currentUserId)){

                  return res.status(403).json({ message: "Not authorized to delete this comment" });
                
                }

               await Restaurant.findByIdAndDelete(restaurantId);

               res.status(200).json({message: "Restaurant deleted successfully"})

           }catch(err){

                res.status(500).json({message:err.message});

           }


}

//get all restaurant owns by current user

export const getAllMineRestaurant = async (req,res) => {
   
      try{
        const userId = req.user.id;

        //pagination setup
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
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Failed to fetch restaurants" });
      }
    };


//get all active restaurant 

export const getActiveRestaurants = async (req,res) =>{

       try{
                //pagination setup 
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page-1)*limit;

                const allActiveRestaurants = await Restaurant.find({isApproved:true})
                    .skip(skip)
                    .limit(limit)

              const totalCount = await Restaurant.countDocuments();

              res.status(200).json({
                        message: 'Restaurants fetched successfully',
                        allActiveRestaurants,
                        totalCount,
                        totalPages: Math.ceil(totalCount / limit),
                        currentPage: page
                    });
                

       }catch(err){

        res.status(500).json({message:'Error fetching active restaurants', err : err.message})

       }

}

// get all restaurants

export const getAllRestaurant = async (req,res)=>{

    try{
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page-1)*limit;

                const allRestaurants = await Restaurant.find()
                       .skip(skip)
                       .limit(limit);

                const totalCount = await Restaurant.countDocuments();

                res.status(200).json({
                    message: 'Restaurants fetched successfully',
                    allRestaurants,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    currentPage: page
                });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch restaurants' });
    }
}


export const approveRestaurant = async (req,res) =>{
   
        try{
               const restaurantId = req.params.id;

               const restaurant = await Restaurant.findById(restaurantId);

               console.log(restaurant);

               restaurant.isApproved =true;

               restaurant.save();

               res.status(200).json({message:"Restaurant approved successfully "})


        }catch(err){
          console.log(err.message);
          res.status(500).json({message : err.message})
        }

}