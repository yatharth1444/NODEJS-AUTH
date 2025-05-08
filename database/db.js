const mongoose = require('mongoose')
const connect_DB = async()=>{
    try {
       await mongoose.connect(process.env.mongoDB_URI)
       console.log(" database connected successfully");
    } catch (error) {
        console.log("database connection failed ");
        process.exit(1)
    }
}
module.exports = connect_DB