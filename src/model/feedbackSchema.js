const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    subject:{
        type : String
    },
    email:{
        type:String,
        pattern:'@gmail\.com$',
        trim:true,
        lowercase:true,
    },
    comment:{
        type:String,
        maxlenght:59,
    },
    added_date:{
        type:Date,
        default:Date.now(),
    },
    statue:{
        type:String,
        enum:['Active','notActive'],
        default:"Active"
    }
})

const feedbackSchema = new mongoose.model("feedback",FeedbackSchema);
module.exports = feedbackSchema;