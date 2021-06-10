const mongoose = require("mongoose");

const inquierySchema = new mongoose.Schema({
    ownerID:{
        type:String
    },
    userName:{
        type:String
    },
    userEmail:{
        type:String
    },
    amount:{
        type:Number
    },
    phone:{
        type:Number
    },
    message:{
        type:String
    },
    Added_date:{
        type:Date,
        default:Date.now
    }
})

const inqueryProp = new mongoose.model("inqueryProperty",inquierySchema);
module.exports = inqueryProp;