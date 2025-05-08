require('dotenv').config()
const express = require('express')
const connectToMongoose = require('./database/db')
const authroutes = require('./routes/auth-routes')
const homeroutes = require('./routes/homeRoutes')
const adminroutes = require('./routes/admin-routes')
const uploadImageRoutes = require('./routes/imageRoutes')
const app = express()
connectToMongoose()

app.use(express.json())
app.use("/api/auth", authroutes)
app.use("/api/home", homeroutes)
app.use("/api/admin", adminroutes)
app.use("/api/image", uploadImageRoutes)
const port = process.env.PORT || 3000
app.listen(port, () => {
   console.log(`Server starts listening at port ${port}`);
})
