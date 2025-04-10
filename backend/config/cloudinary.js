// import {v2 as cloudinary} from 'cloudinary'
import cloudinaryModule from 'cloudinary';
const { v2: cloudinary } = cloudinaryModule;

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

export default cloudinary