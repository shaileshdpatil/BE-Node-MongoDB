const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
    names:{
        type:String,
    },
    // category    :{
    //     type:String,
    //     uppercase: true,
    // },
    added_date:{
        type:Date,
        default:Date.now
    }
})


const subcategory = new mongoose.model("subcategorys",subcategorySchema);
module.exports = subcategory;