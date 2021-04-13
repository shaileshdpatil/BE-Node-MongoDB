const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ownerRegisterSchema = new mongoose.Schema({
    names:{
        type:String,
        required:true
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        lowercase:true,
        required:true
    },
    phone:{
        type:Number,
        unique:true
    },
    gender:{
        type:String,
        enum:['male','female'],
    },
    password:{
        type:String,
        trim:true,
        minlength:2,
        maxlenght:10
    },
    added_date:{
        type:Date,
        default:Date.now
    },
    status:{
        type:Boolean,
        default:false
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})


const ownerRegister = new mongoose.model("ownerRegister",ownerRegisterSchema);
module.exports = ownerRegister;