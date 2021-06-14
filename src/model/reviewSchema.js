const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    propertyId:{
        type:String,
    },
    ownerID:{
        type:String
    },
    userName:{
        type:String
    },
    comment:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

const reviewData = new mongoose.model("reviewByUser",commentSchema);
module.exports = reviewData;