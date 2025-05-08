const Image = require('../model/image') 
const fs = require('fs')
const { uploadToCloudinary } = require ('../helpers/cloudinaryHelper')
const cloudinary = require('../config/cloudinary')
const uploadImageController = async(req, res)=>{
    try {
        if (!req.file){
           res.status(400).json({
            success: false,
            message: "file is required"
           })
        }
        const {url, publicId} = await uploadToCloudinary(req.file.path)

        const newUploadedImage = new Image({
           url,
           publicId,
           uploadedBy: req.userInfo.userId
        })
        await newUploadedImage.save()
        // fs.unlinkSync(req.file.path)
        res.status(201).json({
            success : true,
            message: "image uploaded successfully",
            image:newUploadedImage,
        })
    } catch (error) {
        console.log("error", error)
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "something went wrong"
            
        })
         
    }
}
const fetchImageControlleer = async(req, res)=>{
    try {
        const images = await Image.find({})
        if (images){
            res.status(200).json({
                success: true,
                data: images,
            })
        }
    } catch (error) {
        console.log("error", error)
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "something went wrong"
            
        })
         
    }
}

const deleteImageController = async(req, res)=>{
    try {
      const getCurrentImageToBeDeletedId = req.params.id 
      const userId = req.userInfo.userId
      const image = await Image.findById(getCurrentImageToBeDeletedId)   
      if(!image){
        res.status(404).json({
            success: false,
            message: "image with that id doesnt exists"
        })
      }
      if(image.uploadedBy.toString() !== userId ){
        res.status(403).json({
            success: false,
            message: "image cant be deleted because the user didnt upload it "
        })
      }
    // delete the image first from cloudinary 
    await cloudinary.uploader.destroy(image.publicId)
    // delete the image now from mongoose
    await Image.findByIdAndUpdate(getCurrentImageToBeDeletedId)
    res.status(200).json({
        success: true,
        message: ' successfully image was deleted '
    })


    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
 }

module.exports = {
    uploadImageController,
    fetchImageControlleer,
    deleteImageController
}


