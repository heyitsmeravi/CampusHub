const User = require("../models/User");
const Student = require("../models/Student");
const mongoose = require("mongoose");
const createStudent = async (req, res) => {
    console.log("Creating a new student...");
    const {user,branch,rollNumber, registrationNumber,semester, batch } = req.body;
    if (!user || !branch || !rollNumber || !registrationNumber || !semester || !batch ){
        return res.status(400).json({
            message:"All fields are required"
        });
    }
    
    try{
        if (mongoose.Types.ObjectId.isValid(user)){
            return res.status(400).json({
                message:"Invalid Student Id"
            });
        }
        const existingStudent = await Student.findOne({user});
        if (existingStudent){
            return res.status(409).json({
                message:"Student already exists"
            });
        }
        const existingUser = await User.findById(user);
        if (!existingUser){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        if (existingUser.role !== "student"){
            return res.status(400).json({
                message:"User is not a student"
            });
        }
        const student = await Student.create({
            user,
            branch,
            rollNumber,
            registrationNumber,
            semester,
            batch,
        })
        return res.status(201).json({ 
            message: "Student created successfully",
            student
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

const getAllStudents = async(req, res) => {
    try{
        const students = await Student.find().select("-__v").populate("user", "name role email");
        return res.status(200).json({
            message:"Students fetched successfully",
            students
        });
    }catch(err){
        return res.status(500).json({
            message:"Something went wrong"
        });
    }   
}

const getStudent = async (req, res) => {
    // console.log("get student working");
    const {id} = req.params;
    try{
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message:"Invalid user ID"
            });
        }
        const student = await Student.findById(id).select("-__v").populate("user","name email role");
        if (!student){
            return res.status(400).json({
                message:"Student not found"
            });
        }
        return res.status(200).json({
            message:"Student found successfully",
            student
        }); 
    }catch(err){
        return res.status(500).json({
            message:"Something went wrong"
        })
    }
}

module.exports = {createStudent, getAllStudents, getStudent};