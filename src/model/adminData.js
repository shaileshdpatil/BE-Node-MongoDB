const mongoose = require("mongoose");

const adminData = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
})


const admin = new mongoose.model("adminSchema",adminData);
module.exports = admin;