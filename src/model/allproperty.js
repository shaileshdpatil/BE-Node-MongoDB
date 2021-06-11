const mongoose = require("mongoose");

const allpropertysSchema = new mongoose.Schema({
    ownerID: {
        type: String
    },
    OwnerName: {
        type: String,
    },
    Images: {
        type: Object,
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
    Price: {
        type: Number,
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
})


const Allproperty = new mongoose.model("allpropertyData ", allpropertysSchema);
module.exports = Allproperty;


