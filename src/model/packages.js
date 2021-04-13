const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    no_of_ads:{
        type:Number,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true
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
})


const package = new mongoose.model("package",packageSchema);
module.exports = package;