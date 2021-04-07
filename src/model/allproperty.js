const mongoose = require("mongoose");

const allpropertysSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
    },
    amount:{
        type:Number,
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


const Allproperty = new mongoose.model("allproperty",allpropertysSchema);
module.exports = Allproperty;


