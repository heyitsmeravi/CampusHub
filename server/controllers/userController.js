const User = require("../models/User");
const getAllUsers = async (req, res) =>{
    try{
        const users = await User.find().select("-password");
        console.log(req);
        return res.status(200).json({
            message:"Data fetched successfully",
            users
        });
    }catch (err){
        return res.status(500).json({
            message:"something went wrong"
        });
    }
};
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (user == null){
            return res.status(404).json({
                message:"User not found"
            });   
        }
         return res.status(200).json({
            message:"User found successfully",
            user });
    }
    catch (err){
        // console.log("error in getMyProfile:- ",err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}
module.exports = {
    getAllUsers , getMyProfile
}