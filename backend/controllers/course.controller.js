import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { v2 as cloudinary } from 'cloudinary'

export const createCourse = async (req, res) => {

    try {
        const adminId = req.adminId 
        const { title, description, price } = req.body

        if (!title || !description || !price ) {
            return res.status(400).json({error : "All feilds are required"})
        }

        const {image} = req.files

        if (!req.files || Object.keys(req.files).length === 0 || !image) {
            return res.status(400).json({error : "No files uploaded"})
        }

        const allowedFormat = ["image/png", "image/jpeg"]
        if(!allowedFormat.includes(image.mimetype)){
            return res.status(400).json({error : "Invalid file format. Only JPG and PNG are allowed"})
        }

        // Cloudinary code
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)

        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({error : "Error file uploading to cloudinary"})
        }

        const courseData = {
            title, 
            description, 
            price, 
            image : {
                public_id : cloud_response.public_id,
                url : cloud_response.url 
            },
            creatorId : adminId
        }

        const newCourse = await Course.create(courseData)

        if (newCourse) {
            return res.status(201).json({message : "Course creaated successfully", newCourse})
        }

    } catch (error) {
        console.log("Error in creating course" , error)
        return res.status(500).json({errors : "Error in creating course"})
    }
}

// export const updateCourse = async (req, res) => {
//     const { courseId } = req.params;
//     const adminId = req.adminId

//     try {
//         // Fetch the course first
//         const course = await Course.findById(courseId);

//         if (!course) {
//             return res.status(404).json({ error: "Course not found" });
//         }

//         // Update basic fields if provided
//         const { title, description, price } = req.body;
//         if (title) course.title = title;
//         if (description) course.description = description;
//         if (price) course.price = price;

//         // Check if a new image is uploaded
//         if (req.files && req.files.image) {
//             const image = req.files.image;

//             const allowedFormat = ["image/png", "image/jpeg"];
//             if (!allowedFormat.includes(image.mimetype)) {
//                 return res.status(400).json({ error: "Invalid file format. Only JPG and PNG are allowed" });
//             }

//             // Delete old image from Cloudinary
//             if (course.image?.public_id) {
//                 await cloudinary.uploader.destroy(course.image.public_id);
//             }

//             // Upload new image
//             const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
//             course.image = {
//                 public_id: cloud_response.public_id,
//                 url: cloud_response.secure_url
//             };
//         }

//         // Save the updated course
//         await course.save();

//         return res.status(200).json({ message: "Course updated successfully", updatedCourse: course });

//     } catch (error) {
//         console.error("Error updating course:", error);
//         return res.status(500).json({ error: "Error updating course" });
//     }
// };

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;

  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url,
        },
      }
    );
    if (!course) {
      return res
        .status(404)
        .json({ errors: "can't update, created by other admin" });
    }
    res.status(201).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ errors: "Error in course updating" });
    console.log("Error in course updating ", error);
  }
};

export const deleteCourse = async (req, res) => {
    const adminId = req.adminId
    const { courseId } = req.params;

    try {
        // Find the course first
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Delete the image from Cloudinary
        if (course.image?.public_id) {
            await cloudinary.uploader.destroy(course.image.public_id);
        }

        // Delete the course from MongoDB
        // await Course.findByIdAndDelete(courseId);
        await Course.findOneAndDelete(
        {
            _id:courseId,
            creatorId:adminId
        });

        return res.status(200).json({ message: "Course and image deleted successfully" });

    } catch (error) {
        console.error("Error in deleting course", error);
        return res.status(500).json({ errors : "Error in deleting course" });
    }
};

export const getCourses = async (req, res) => {
    
    try {

        const courses = await Course.find({})

        return res.status(201).json({ courses })

    } catch (error) {
        console.error("Error in fetching courses", error);
        return res.status(500).json({ errors : "Error in feting all courses" });
    }
};

export const courseDetails = async(req, res) => {
    try {
        
        const { courseId } = req.params

        const course = await Course.findById(courseId)
        
        if (!course) {
            return res.status(404).json({error : "Course not found"})
        }

        return res.status(201).json({ course })


    } catch (error) {
        console.error("Error in course detail", error);
        return res.status(500).json({ errors : "Error in course details " });
    }
}

export const buyCourses = async(req, res) => {
    try {
        
        const {userId} = req
        const { courseId } = req.params
        
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({error : "Course not found"})
        }
        
        const existingPurchase = await Purchase.findOne( {userId, courseId} )

        if (existingPurchase) {
            return res.status(400).json({error : "Course already purchased"})
        }

        const newPurchase = await Purchase.create( {userId, courseId} )

        return res.status(201).json({message : "Course purchased successfully", newPurchase})

    } catch (error) {
        console.error("Error in course buy", error);
        return res.status(500).json({ errors : "Error in course buy " });
    }
}




