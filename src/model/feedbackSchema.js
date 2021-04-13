const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    name:{
        type : String
    },
    email:{
        type:String,
    },
    message:{
        type:String,
    },
    added_date:{
        type:Date,
        default:Date.now(),
    },
    status:{
        type:Boolean,
        default:false
    }
})

const feedbackSchema = new mongoose.model("feedback",FeedbackSchema);
module.exports = feedbackSchema;