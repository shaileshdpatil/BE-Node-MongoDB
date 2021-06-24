const mongoose = require("mongoose");
const ownerRegisterSchema = new mongoose.Schema({
    packageName: {
        type:String,
    },
    transactionID:{
        type:String,
    },
    amount:{
      type:Number,  
    },
    names: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    no_of_ads:{
        type:String,
    },
    phone: {
        type: Number,
        unique: true
    },
    password: {
        type: String,
    },
    PaymetDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false
    },
})


const ownerRegister = new mongoose.model("ownerRegister", ownerRegisterSchema);
module.exports = ownerRegister;