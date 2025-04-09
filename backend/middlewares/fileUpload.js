 import cloudinary from "../config/cloudinary";
 import multer from multer

import cloudinary from "../config/cloudinary";

const storage  = new cloudinaryStorage({
    cloudinary : cloudinary,
    parmas : {
        folder:'uploads',
        allwoed_formats:['jpg', 'png', 'jpeg'],
    } 
});

const upload =multer({storage:storage});

module.exports = {
    upload,
    storage
}