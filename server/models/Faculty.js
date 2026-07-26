const mongoose = require('mongoose');
const facultySchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    },
    department : {
        type:String,
        required : true,
        enum :["IT","CSE","ECE","EE","MECH","CIVIL","CHEMICAL","BMR","MNC"],
        trim: true
    },
    facultyId : {
        type : Number,
        required : true,
        trim: true,
        unique: true
    }
});
const Faculty = mongoose.model('Faculty',facultySchema);
module.exports = Faculty;