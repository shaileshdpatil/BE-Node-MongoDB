const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const user_registerSchema = new mongoose.Schema({
    name:{
        type:String,
        minlenght:4,
        maxlenght:20
    },
    email:{
        type:String,        
        trim:true,
        pattern : "@gmail\.com$",
        lowercase:true,
        unique:true,
        required:true,
    },
    phone:{
        type:Number,
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    status:{
        type:String,
        enum:['active','notActive'],
        default:"active"
    }
})

user_registerSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        next();
    }
});
const user_register = new mongoose.model("user_register",user_registerSchema);
module.exports = user_register;