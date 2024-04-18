import { users } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../util/apiError.js";

export const checkAuth = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if(!token){
            // return res.status(401).json(
            //     new ApiError(401, "Unauthorized Request")
            // )
            return next();
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await users.findById(decodedToken?._id).select('-password -refreshToken');

        if(!user) {
            // return res.status(401).json(
            //     new ApiError(401, 'Invalid Access Token')
            // )
            return next();
        }

        req.user = user;
        next();
    } catch (error) {
       next();
    }
}