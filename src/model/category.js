const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        uppercase: true
    },
    added_date:{
        type:Date,
        default:Date.now
    }
})


const category = new mongoose.model("categorys",categorySchema);
module.exports = category;