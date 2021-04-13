const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
    country:{
        type:String,
        required:true,
        minLenght:3,
        maxLenght:15
    },
    states:{
        type:String,
        required:true,
        minLenght:3,
        maxLenght:15
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


const state = new mongoose.model("states",stateSchema);
module.exports = state;