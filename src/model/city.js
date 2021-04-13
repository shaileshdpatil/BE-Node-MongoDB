const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
    citys:{
        type:String,
        minLenght:3,
        maxLenght:15,
        required:true,
        unique:true,
    },
    states:{
        type:String,
        minLenght:3,
        maxLenght:15,
        required:true,
        unique:true,
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


const city = new mongoose.model("citys",citySchema);
module.exports = city;