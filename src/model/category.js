const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
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


const category = new mongoose.model("categorys",categorySchema);
module.exports = category;