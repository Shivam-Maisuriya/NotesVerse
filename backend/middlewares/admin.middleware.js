import jwt from "jsonwebtoken"

function adminMiddleware(req, res, next) {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({errors : "No token provided"})
    }

    const token = authHeader.split(" ")[1]

    try {

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET)
        
        req.adminId = decoded.id 
        next()
        
        
    } catch (error) {
        return res.status(401).json({errors : "Invalid or expired token"})
        console.log("Invalid or Expired token :" , error)
    }

}

export default adminMiddleware


