import express from 'express';
import Restaurant from '../models/Restaurant.js';
import { checkOwnership } from '../utils/index.js';
// import mongoose from 'mongoose';



export const addRestaurant = async (req,res) =>{
    
      try{
         const {name, location,deliveryAreas,promotion,} = req.body;

         const newRestaurant = new Restaurant({

              name,
              location :{
                type:"point",
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
        const restaurantId = req.body.restaurant._id;
        const currentUserId =req.user.id;

        const restaurant = await Restaurant.findById({restaurantId});

        if(!restaurant){

           return res.status(404).json({message: "Restaurant not found"});

        }
        
        if(!checkOwnership(restaurant.ownerId,currentUserId)){

            return res.status(403).json({message:"Unauthorized"});

        }

        const {name, location, deliveryAreas,promotion} =req.body
        const result = await Restaurant.findByIdAndUpdate({
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

               const restaurantId = req.body.restaurant._id;
               const currentUserId = req.user.id;

               const restaurant = await findById({restaurantId});

               if(!checkOwnership(restaurant.ownerId, currentUserId)){

                  return res.status(403).json({ message: "Not authorized to delete this comment" });
                
                }

               await Restaurant.findByIdAndDelete(restaurantId);

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

        const myRestaurants =await Restaurant.fin({ownerId:userId})
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

                const allActiveRestaurants = await Restaurant.findAll({isApproved:true})
                    .skip(skip)
                    .limit(limit)

                res.status(200).json({message: 'Active restaurants fetched successfully',data:allActiveRestaurants,});
                

       }catch(err){

        res.status(500).json({message:'Error fetching active restaurants', err : err.message})

       }

}

// get all restaurants

