const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ownerRegisterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        pattern:"@gmail\.com$",
        trim:true,
        unique:true,
        lowercase:true,
        required:true
    },
    phone:{
        type:Number,
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
        unique:true
    },
    gender:{
        type:String,
        default:"male"
    },
    password:{
        type:String,
        trim:true,
        minlength:5,
        maxlenght:10
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
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})


ownerRegisterSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        next();
    }
});

//tokens
ownerRegisterSchema.methods.generateAuthToken = async function (){
    try{
        let token = jwt.sign({ _id: this._id}, process.env.TOKEN_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
}


const ownerRegister = new mongoose.model("ownerRegister",ownerRegisterSchema);
module.exports = ownerRegister;