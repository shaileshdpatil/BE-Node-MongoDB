const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
    namesData:{
        type:String,
    },
    categoryData:{
        type:String,
        index: false
    },
    added_date:{
        type:Date,
        default:Date.now
    }
})


const subcategory = new mongoose.model("subcategorys",subcategorySchema);
module.exports = subcategory;