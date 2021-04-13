const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
    OwnerName:{
        type:String,
        required:true,
        unique:true,
    },
    customerName:{
        type:String,
        required:true,
        unique:true,
    },
    amount:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
        required:true
    },
    added_date:{
        type:Date,
        default:Date.now
    }

})

const dealschema = new mongoose.model("feedbackSchema",dealSchema);
module.exports = dealschema;