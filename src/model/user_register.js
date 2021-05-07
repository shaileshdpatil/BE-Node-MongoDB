const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const user_registerSchema = new mongoose.Schema({
    Fname:{
        type:String,

    },
    Lname:{
        type:String,
    },
    email:{
        type:String,        
        trim:true,
        lowercase:true,
        unique:true,
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
const user_register = new mongoose.model("user_register",user_registerSchema);
module.exports = user_register;