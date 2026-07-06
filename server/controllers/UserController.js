



import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Signup a new user
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    // Check if all fields are provided
    if (!fullName || !email || !password || !bio) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // Check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    // Token will be generated here later
    const token = generateToken(newUser._id);

    return res.json({
      success: true,
      message: "Account Created Successfully",
      userData: newUser,
      token,
    });

  } catch (error) {
    console.log(error.message);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};



  export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // Find user
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userData.password
    );

    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token (add your JWT code here)
    const token = generateToken(userData._id);

    return res.json({
      success: true,
      message: "Login Successful",
      user: userData,
      token,
    });

  } catch (error) {
    console.log(error.error);

    return res.json({
      success: false,
      message: error.message,
    });
  }


} ;

export const checkAuth=(req,res)=>{
    res.json({success:true,user:req.user})
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    // Update only text fields if no image is provided
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          bio,
        },
        {
          new: true,
        }
      );

      return res.json({
        success: true,
        user: updatedUser,
      });
    }

    console.log("========== IMAGE INFO ==========");
    console.log("Profile Pic Exists:", !!profilePic);
    console.log("Type:", typeof profilePic);
    console.log("Length:", profilePic.length);
    console.log("Starts With:", profilePic.substring(0, 50));

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "WingChat",
      resource_type: "image",
    });

    console.log("Cloudinary Upload Success:", uploadResponse.secure_url);

    updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        profilePic: uploadResponse.secure_url,
      },
      {
        new: true,
      }
    );

    return res.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("========== CLOUDINARY ERROR ==========");
    console.dir(error, { depth: null });
    console.error("======================================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};