import mongoose from "mongoose";

const RestaurantSchema=new mongoose.Schema(
    {
    RestaurantId:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true ,index:true},
    Name:{type:String,required:true},
    Locaton:{type:{type:String,enum:['Point'],required:true},
             Coordinates:{type:number,required:true},
             address:string
          },
    Menu:[{name:String,description:String,price:Number,category:String}],
    Rating:{type:number,min:0,max:5,default:0},
    DeliverAreas:{type:[String]},
    promotion:[{title:String,description:String,discount:Number,validuntil:Date}]

})
RestaurantSchema.index({Location:"2dsphere"});

const Restaurant=mongoose.model('Restaurant',RestaurantSchema);

export default Restaurant

// `RestaurantID` (Primary Key)
//   - `Name`
//   - `Location`
//   - `Menu`
//   - `Rating`
//   - `DeliveryAreas`
//   - `Promotions`
// - **Indexes**:
//   - `RestaurantID` (Primary Key)
//   - `Location` (Geospatial Index)
