const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body

        const checkExistingUser = await User.findOne({
            $or: [{ Username: username }, { email }]
        })

        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with that username or email.'
            })
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            Username: username,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        await newUser.save()

        res.status(201).json({
            success: true,
            message: 'New user created successfully.'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Something went wrong.'
        })
    }
}


// login endpoint 
const loginUser = async(req, res )=>{
    try {
       const  {username, password} = req.body
       const checkUserExists = await User.findOne({Username : username})
       if(!checkUserExists){
        res.status(400).json({
            success: false,
            message:'invalid credentials ',
        })
       }
       const isPasswordMatch = await bcrypt.compare(password, checkUserExists.password)
       if(!isPasswordMatch){
        res.status(404).json({
            success: false,
            message:'invalid credentials ',
        })
       }
       //bearer token
    const accessToken = jwt.sign({
        userId : checkUserExists._id,
        username : checkUserExists.Username,
        role : checkUserExists.role
    },  process.env.JWT_SECRET_KEY,{
        expiresIn : '15m'
    })
    res.status(200).json({
        success: true,
        message: 'user logged in',
        accessToken
    })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

const changePassword = async(req, res)=>{
    try {
        const userId = req.userInfo.userId
        // exract old and new paaswds
        const {oldPassword, newPassword} = req.body;
        //find the current logged user 
        const user = await User.findById(userId)
        
        if(!user){
            return res.status(200).json({
                success: false,
                message: 'user doesnt exists'
            })
        }
        const isPasswordMatched = await bcrypt.compare(oldPassword, user.password )
        if(!isPasswordMatched){
            return res.status(400).json({
                success: false,
                message: 'passwords didnt match, the old passwd entered wasnt correct to change you need to enter the right password here '
            })
        }
        const salt = await bcrypt.genSalt(10)
        const newHashedPassword = await bcrypt.hash(newPassword, salt)
        user.password = newHashedPassword
        await user.save()
        res.status(200).json({
            success: true,
            message: "password updated"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}
 


 module.exports = {registerUser, loginUser, changePassword}