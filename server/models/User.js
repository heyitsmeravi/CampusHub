const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required: [true,"Password is required"],
    },
    name:{
        type:String,
        required: [true, "Name is required"],
    },
    role:{
        type:String,
        required:true,
        enum:["student","faculty","admin"]
    },
    isActive:{
        type: Boolean,
        default:true
    },
    lastLogin:{
        type:Date,
        default: null,
    }
    },
    {
    timestamps:true
    });
const User = mongoose.model('User', userSchema);
module.exports = User;
