const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    branch:{
        type:String,
        required: [true, "Branch is required"],
        trim:true,
        enum:["IT","CSE","ECE","EE","MECH","CIVIL","CHEMICAL","BMR","MNC"]
    },
    rollNumber: {
        type: String,
        required: [true,"Roll Number is required"],
        unique: true,
        trim:true,
    },
    registrationNumber:{
        type: String,
        required: [true,"Registration Number is required"],
        unique: true,
        trim:true,
    },
    semester:{
        type:Number,
        required: [true,"Semester is required"],
        min:1,
        max:8
    },
    // cgpa:{
    //     type:Number,
    //     min:0,
    //     max:10
    // },
    batch:{
        type:Number,
        required: [true,"Batch is required"],
        min:2000,
        max:2100
    }
});
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;