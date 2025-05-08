const express = require('express')
const authmiddleware = require('../middleware/auth-middleware')
const isAdminUser = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/upload-middleware')
const { uploadImageController, fetchImageControlleer, deleteImageController } = require('../controllers/image-Controller')
const router = express.Router()

router.post('/upload', authmiddleware, isAdminUser, uploadMiddleware.single('image'), uploadImageController )
router.get('/get', authmiddleware, fetchImageControlleer)
router.delete('/:id', authmiddleware, isAdminUser, deleteImageController)
module.exports = router