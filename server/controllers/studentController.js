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
            if (!mongoose.Types.ObjectId.isValid(user)){
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
                    message: "User not found"
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
                    message:"Invalid student ID"
                });
            }
            const student = await Student.findById(id).select("-__v").populate("user","name email role");
            if (!student){
                return res.status(404).json({
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
    const updateStudent = async (req, res) => {
        const ADMIN_ALLOWED_UPDATION_FIELDS = ["branch","semester","registrationNumber","rollNumber","batch"];
        const {id} = req.params;
        try{
            const requestedFields = Object.keys(req.body);
            if (requestedFields.length === 0){
                return res.status(400).json({
                    message:"No fields provided for update"
                })
            }
            for (const field of requestedFields){
                if (!ADMIN_ALLOWED_UPDATION_FIELDS.includes(field)){
                    return res.status(400).json({
                        message:`${field} can't be updated`
                    });
                }
            }
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                message: "Invalid student ID"
                });
            }
            
            console.log("Updating student...");
            const student = await Student.findById(id);
            if (!student) {
                return res.status(404).json({
                    message:"Student not found"
                });
            }
            requestedFields.forEach(field => {
                student[field] = req.body[field];
            });
            await student.save();
            return res.status(200).json({
                message:"Student updated successfully",
                student
            });
            
        }catch(err){
            console.log(err);
            return res.status(500).json({
                message:"Something went wrong"
            });
        }
    }

    const deleteStudent = async (req, res) => {
        const {id} = req.params;
        try{
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({
                message: "Invalid student ID"
                });
            }
            const student = await Student.findById(id);
            if (!student) {
                return res.status(404).json({
                    message:"Student not found"
                });
            }
            await Student.findByIdAndUpdate(id, {isActive: false}, {returnDocument: "after"});
            return res.status(200).json({
                message:"Student deactivated successfully"
            });
        }catch(err){
            console.log(err);
            return res.status(500).json({
                message:"Something went wrong"
            });
        }
    }
    const getMyProfile = async (req, res) => {
        try {
            const student = await Student.findOne({user:req.user.id}).select("-__v").populate("user","name email role");
            if (!student){
                return res.status(404).json({
                    message:"Student not found"
                });
            }
            return res.status(200).json({
                message:"Profile fetched successfully",
                student
            });
        } catch (err){
            return res.status(500).json({
                message:"Something went wrong"
            });
        }
    }

    const STUDENT_ALLOWED_UPDATION_FIELDS = ["semester"];
    const updateMyProfile = async (req, res) => {
        const requestedFields = Object.keys(req.body);
        try {
            if (requestedFields.length === 0){
                return res.status(400).json({
                    message:"No fields provided for update"
                });
            }
            for (const field of requestedFields){
                if (!STUDENT_ALLOWED_UPDATION_FIELDS.includes(field)){
                    return res.status(400).json({
                        message:`${field} can't be updated`
                    });
                }
            }
            const student = await Student.findOne({user:req.user.id}).select("-__v").populate("user","name email role");
            if (!student){
                return res.status(404).json({
                    message:"Student not found"
                });
            }
            requestedFields.forEach(field => {
                student[field] = req.body[field];
            });
            await student.save();
            return res.status(200).json({
                message:"Profile updated successfully",
                student
            });

        } catch (err){
            return res.status(500).json({
                message:"Something went wrong"
            });
        }
    }
    module.exports = {createStudent, getAllStudents, getStudent, updateStudent, deleteStudent ,getMyProfile, updateMyProfile};