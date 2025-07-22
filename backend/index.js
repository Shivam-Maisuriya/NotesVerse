import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import fileUpload from "express-fileupload"
import { v2 as cloudinary } from 'cloudinary'
import cookieParser from 'cookie-parser';

import courseRoute from './routes/course.route.js'
import userRoute from './routes/user.route.js'
import adminRoute from './routes/admin.route.js'

const app = express()
dotenv.config()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const port = process.env.PORT || 4000 

// mongodb connection
try {
    mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")
} catch (error) {
    console.log(error)
}


// defining routes
app.use("/api/course", courseRoute)
app.use("/api/user", userRoute)
app.use("/api/admin", adminRoute)

// cloudinary configuration code 
cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET 
    });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
