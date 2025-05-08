const express = require ('express')
const authmiddleware = require('../middleware/auth-middleware')
const isAdminUser = require('../middleware/admin-middleware')
const router = express.Router()
router.get('/welcome', authmiddleware, isAdminUser, (req, res)=>{
       res.json({
        message: 'Home page'
       })
})
module.exports = router  