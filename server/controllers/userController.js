const User = require("../models/User");
const getAllUsers = async (req, res) =>{
    try{
        const users = await User.find().select("-password");
        return res.status(200).json({
            "message":"Data fetched successfully",
            users
        });
    }catch (err){
        console.log(err);
        return res.status(500).json({
            "message":"something went wrong"
        });
    }
};
module.exports = {
    getAllUsers
}