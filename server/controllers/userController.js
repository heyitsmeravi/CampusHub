const User = require("../models/User");
const mongoose = require("mongoose");
const getAllUsers = async (req, res) =>{
    try{
        const users = await User.find().select("-password");
        // console.log(req);
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
const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message:"Invalid user ID"
            });
        }
        const user = await User.findById(id).select("-password");
        if (user == null){
            return res.status(404).json({
                message:"User not found"
            });   
        }
        return res.status(200).json({
            message:"Data fetched successfully",
            user
        });
        
    } catch(err){
        return res.status(500).json({
            message:"something went wrong"
        });
    }
}
const ALLOWED_PROFILE_FIELDS = [
            "name"
        ];
const updateMyProfile = async (req , res) =>{
    try {
        const requestedFields = Object.keys(req.body);
        if (requestedFields.length === 0 ){
            return res.status(400).json({
                message:"No fields provided for update"
            });
        }
        for (const field of requestedFields){
            if (!ALLOWED_PROFILE_FIELDS.includes(field)){
                return res.status(400).json({
                    message:`${field} can't be updated`
                });
            }
            if (field === "name"){
                if (req.body[field].trim() === ""){
                    return res.status(400).json({
                        message:"Name cannot be empty."
                    });
                }
            }
        }
        const changes = await User.findByIdAndUpdate(req.user.id,req.body,{
            returnDocument:"after",
            runValidators:true
        });
        if (changes == null){
            return res.status(404).json({
                message:"User not found"
            });
        }
        const { password, ...userWithoutPassword} = changes.toObject();
        // console.log(user);
        return res.status(200).json({
            message:"data updated successfully",
            user:userWithoutPassword
        })
        // console.log("PATCH route hit");
        // console.log("when in update profile",req.body);
    } catch (err){
        if (err.name === "ValidationError"){
            return res.status(400).json({
                message: err.message
            })
        }
        return res.status(500).json({
            message:"something went wrong"
        });
    }
}
module.exports = {
    getAllUsers , getMyProfile , getUser , updateMyProfile
}