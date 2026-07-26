const Faculty = require('../models/Faculty');
const mongoose = require('mongoose');
const User = require('../models/User');

const createFaculty = async (req, res) =>{
    console.log("creating Faculty");
    const {user , department , facultyId } = req.body;
    if (!user || !department || !facultyId){
        return res.status(400).json({
            message:"All Fields are required!"
        });
    }
    try {
        if (!mongoose.Types.ObjectId.isValid(user)){
            return res.status(400).json({
                message:"Invalid User Id"
            });
        }
        const existingFaculty = await Faculty.findOne({user});
        if (existingFaculty){
            return res.status(409).json({
                message:"Faculty already exists"
            });
        }
        const existingUser = await User.findById(user);
        if (!existingUser){
            return res.status(404).json({
                message:"User Not Found"
            });
        }
        if (existingUser.role != "faculty"){
            return res.status(400).json({
                message:"User is not a Faculty"
            });
        }
        const faculty = await Faculty.create({
            user,
            department,
            facultyId
        });
        return res.status(201).json({
            message:"Faculty created Successfully",
            faculty
        });

    } catch (err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}
const ADMIN_ALLOWED_UPDATION_FIELD = ["department"]
const updateFaculty = async (req, res) =>{
    console.log("Updating Faculty");
    const {id} = req.params;
    const requestedFields = Object.keys(req.body);
    try {
        if (requestedFields.length === 0) {
            return res.status(400).json({
                message: "No fields provided for update"
            });
    }
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message:"Invalid Faculty Id"
            });
        }
        const faculty = await Faculty.findById(id).select("-__v").populate("user", "name email role");
        if (!faculty){
            return res.status(400).json({
                message:"Faculty not found"
            });
        }
        for (const field of requestedFields){
            if (!ADMIN_ALLOWED_UPDATION_FIELD.includes(field)){
                return res.status(400).json({
                    message:`${field} can't be updated`
                });
            }
        }
        requestedFields.forEach(field => {
            faculty[field] = req.body[field];
        }); 
        await faculty.save();
        return res.status(200).json({
            message:"Faculty updated successfully",
            faculty
        })

    } catch (err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        })
    }
}

const getFaculty = async (req, res) => {
    console.log("getting Faculty ");
    const {id} = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message:"Invalid Faculty Id"
            });
        }
        const faculty = await Faculty.findById(id).select("-__v").populate("user","name email role");
        if (!faculty){
            return res.status(400).json({
                message:"Faculty not found"
            });
        }
        return res.status(200).json({
            message:"Facutly fetched successfully",
            faculty
        })
    }catch(err){
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

const deleteFaculty = async (req, res) => {
    console.log("deleting Faculty");
    const {id} = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message:"Invalid Faculty Id"
            });
        }
        const faculty = await Faculty.findById(id);
        if (!faculty){
            return res.status(400).json({
                message:"Faculty not found"
            });
        }
        await Faculty.findByIdAndUpdate(id,{isActive:false},{returnDocument:"after"});
        return res.status(200).json({
            message:"Faculty deactivated successfully"
        })
    }catch(err){
        return res.status(500).json({
            message:"Something went wrong"
        });
    }

}

const getAllFaculties = async (req, res) => {
    console.log("getting Faculties");
    try{
        const faculties = await Faculty.find().select("-__v").populate("user","name email role");
        return res.status(200).json({
            message:"Faculties found successfully",
            faculties
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

module.exports = {createFaculty, updateFaculty, getFaculty , getAllFaculties, deleteFaculty};