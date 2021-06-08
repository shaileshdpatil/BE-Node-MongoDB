const mongoose = require("mongoose");

const user_registerSchema = new mongoose.Schema({
    Fname:{
        type:String,

    },
    Lname:{
        type:String,
    },
    email:{
        type:String,        
    },
    phone:{
        type:Number,
    },
    password:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    },
})
const user_register = new mongoose.model("user_register",user_registerSchema);
module.exports = user_register;