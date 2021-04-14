const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
    names:{
        type:String,
    },
    category:{
        type:String,
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


const subcategory = new mongoose.model("subcategorys",subcategorySchema);
module.exports = subcategory;