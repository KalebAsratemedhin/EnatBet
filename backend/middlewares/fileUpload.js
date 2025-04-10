 import cloudinary from "../config/cloudinary.js";
 import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'


export const storage  = new CloudinaryStorage({
    cloudinary : cloudinary,
    parmas : {
        folder:'uploads',
        allwoed_formats:['jpg', 'png', 'jpeg'],
    } 
});

export const upload =multer({storage:storage});

// module.exports = {
//     upload,
//     storage
// }