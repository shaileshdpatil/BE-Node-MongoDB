const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
    country:{
        type:String,
        default:"india"
    },
    states:{
        type:String,
        unique:true,
        index:true
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