const mongoose = require("mongoose");

const inquieryRespSchema = new mongoose.Schema({
    ownerID:{
        type:String
    },
    propertyId:{
        type:String
    },
    inqueryID:{
        type:String,
    },  
    ownerName:{
        type:String
    },  
    userEmail:{
        type:String
    },
    amount:{
        type:Number
    },
    message:{
        type:String
    },
    isCompleted:{
        type:Boolean,
        default:false
    }
})

const inqueryResponse = new mongoose.model("inquieryResponseSchema",inquieryRespSchema);
module.exports = inqueryResponse;