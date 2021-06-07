const mongoose = require("mongoose");

const inquierySchema = new mongoose.Schema({
    userId:{
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
    }
})

const inqueryProp = new mongoose.model("inqueryProperty",inquierySchema);
module.exports = inqueryProp;