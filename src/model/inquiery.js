const mongoose = require("mongoose");

const inquierySchema = new mongoose.Schema({
    propertyId:{
        type:String
    },
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
    },
    isCompleted:{
        type:Boolean,
        default:false
    }
})

const inqueryProp = new mongoose.model("inqueryProperty",inquierySchema);
module.exports = inqueryProp;