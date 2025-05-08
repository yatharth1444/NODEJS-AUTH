const isAdminuser = (req, res, next)=>{
    if (req.userInfo.role !== "admin"){
        res.status(403).json({
            success: false,
            message: "user is not admin so cant access this route"
        })
    }
    next()
}
module.exports = isAdminuser