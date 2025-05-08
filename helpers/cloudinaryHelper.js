const cloudinary = require('../config/cloudinary')
const uploadToCloudinary = async(filepath)=>{
    try {
        const result = await cloudinary.uploader.upload(filepath)
        return{
            url: result.secure_url,
            publicId: result.public_id,
        }
    } catch (error) {
        console.log("error while uploading the file", error);
        throw new Error("error while uploading file to cloudinary")
    }
}
module.exports ={
    uploadToCloudinary
}