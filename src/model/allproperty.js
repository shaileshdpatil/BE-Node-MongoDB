const mongoose = require("mongoose");

const allpropertysSchema = new mongoose.Schema({
    userID:{
        
    },
    PropertyName: {
        type: String,
        minlenght: 4,
        maxlenght: 20
    },
    FullAddress: {
        type: String,
        minlenght: 4,
        maxlenght: 50
    },
    description: {
        type: String,
        minlenght: 4,
        maxlenght: 20
    },
    Price: {
        type: Number,
        maxlenght: 20

    },
    No_of_Floors: {
        type: Number,
        maxlenght: 20

    },
    No_of_Rooms: {
        type: Number,
        maxlenght: 20

    },
    No_of_BeedRoom: {
        type: Number,
        maxlenght: 20

    },
    No_of_Garage: {
        type: Number,
        maxlenght: 20

    },
    No_of_Bathroom: {
        type: Number,
        maxlenght: 20

    },
    No_of_Living_Room: {
        type: Number,
        maxlenght: 20

    },
    City: {
        type: String,
        minlenght: 4,
        maxlenght: 20
    }
})


const Allproperty = new mongoose.model("allpropertyData ", allpropertysSchema);
module.exports = Allproperty;


