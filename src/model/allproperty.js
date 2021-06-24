const mongoose = require("mongoose");

const allpropertysSchema = new mongoose.Schema({
    ownerID: {
        type: String
    },
    OwnerName:{
        type:String,
    },
    PropertyName: {
        type: String,
    },
    FullAddress: {
        type: String,
    },
    description: {
        type: String,
    },
    location:{
        type:String,
    },
    Price: {
        type: String,
    },
    No_of_Floors: {
        type: Number,
    },
    No_of_Rooms: {
        type: Number,
    },
    No_of_BeedRoom: {
        type: Number,
    },
    No_of_Garage: {
        type: Number,
    },
    No_of_Bathroom: {
        type: Number,
    },
    No_of_Living_Room: {
        type: Number,
    },
    sqrft: {
        type: String
    },
    City: {
        type: String,
    },
    Images: {
        type: Object,
    },
    builtyear:{
        type:Number
    },
    category:{
        type:String
    },
    isCompleted:{
        type:Boolean,
        default:false
    }
})


const Allproperty = new mongoose.model("allpropertyData ", allpropertysSchema);
module.exports = Allproperty;


