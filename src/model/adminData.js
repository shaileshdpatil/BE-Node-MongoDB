const mongoose = require("mongoose");

const adminData = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minLenght:3,
        maxLenght:15,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLenght:3,
        maxLenght:15,
        unique:true
    },
    added_date:{
        type:Date,
        default:Date.now
    },
})


const admin = new mongoose.model("adminSchema",adminData);
module.exports = admin;