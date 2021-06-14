const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
    userEmail:{
        type:String,
    },
    ownerID:{
        type:String,
    },
    ownerName:{
        type:String
    },
    amount:{
        type:Number,
        required:true
    },
    propertyId:{
        type:String,
    },
    deal:{
        type:String,
        default:'comleted'
    },
    added_date:{
        type:Date,
        default:Date.now
    }

})

const shailuKiDeal = new mongoose.model("shailuIsLoveDeal",dealSchema);
module.exports = shailuKiDeal;