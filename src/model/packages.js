const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
    },
    no_of_ads:{
        type:Number,
    },
    amount:{
        type:Number,
    },
    description:{
        type:String,
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