const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ownerRegisterSchema = new mongoose.Schema({
    name:{
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
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
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
        type:String,
        enum:['active','notActive'],
        default:"active"
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