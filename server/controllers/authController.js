const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registerUser = async (req,res) =>{
    const {name, email, password, role } = req.body;
    console.log(req.body);
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
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        })
    }
 
}
const loginUser = async (req,res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password){
        return res.status(400).json({
            message:"all fields are required"
        });
    }
    try {
        const user = await User.findOne({
        email
        });
        if (!user){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const canLogin = await bcrypt.compare(password,user.password);
        if(!canLogin){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const token = jwt.sign({
            id: user._id,
            role:user.role
        },process.env.JWT_SECRET,{
            expiresIn:"1d"
        });
        return res.status(200).json({
            message:"Login sucessful",
            token
        });
        
    } catch (err){
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

module.exports = {registerUser,loginUser};