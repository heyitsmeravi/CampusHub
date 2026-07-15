const User = require("../models/User");
const bcrypt = require('bcrypt');
const registerUser = async (req,res) =>{
    const {name, email, password, role } = req.body;
    if (!name || !email || !role || !password){
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    const existingUser = await User.findOne({
        email
    })
    if ( existingUser){
        return res.status(409).json({
            message:"Email already Exists!"
        });
    }
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role
        });
        return res.status(201).json({
            message:"User registered successfully"
        });
    }catch(err){
        return res.status(500).json({
            message:"Something went wrong"
        })
    }
 
}
module.exports = {registerUser};