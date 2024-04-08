import { users } from "../models/user.model.js";
import { ApiError } from "../util/apiError.js";
import { apiResponse } from "../util/apiResponse.js";
async function getSignup(req, res){
    return res.render('signup.ejs');
};


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await users.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

async function postSignup(req, res){
    const { fullName, username, email, password } = req.body;
    if([fullName,username,email,password].some((field)=> field?.trim() === "")){
        return res.status(400).json(
            new ApiError(400,'All fields are required')
        )
    }

    const isExisted = await users.findOne({
        $or: [{username} , {email}]
    })

    if(isExisted){
        return res.status(409).json(
            new ApiError(409, 'Try Different Usename or Email')
        )
    }

    const user = await users.create({
        fullName,
        username,
        email,
        password,
        role: 'USER'
    })

    const createdUser = await users.findById(user._id).select(
        "-password "
    )

    if(!createdUser){
        return res.status(500).json(
            new ApiError(500, 'Something went wrong, try again !!!')
        )
    }

    
    return res.status(201).json(
        new apiResponse(201, createdUser, 'User registered succcessfully')
    )
};
    

async function getLogin(req, res){
    return res.render('login.ejs');
};


async function postLogin(req, res){
    const { email, password } = req.body;
    if(!email) return res.status(400).json(
        new ApiError(400,"Email is rquired!!!")
    )

    const user = await users.findOne({email});
    if(!user) return res.status(404).json(
        new ApiError(404,"User does not exist !!!")
    )

    const passwordValidate = await user.isPasswordCorrect(password);
    if(!passwordValidate) return res.status(401).json(
        new ApiError(401, 'Password is incorrect !!!')
    )

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    const loggedInUser = await users.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
};

export {
    getLogin,
    getSignup,
    postLogin,
    postSignup
}