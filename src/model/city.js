const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
    citys:{
        type:String,
        unique:true
    },
    added_date:{
        type:Date,
        default:Date.now
    },
})


const city = new mongoose.model("citys",citySchema);
module.exports = city;