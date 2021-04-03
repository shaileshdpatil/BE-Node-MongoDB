require('dotenv').config()
const express = require("express");
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

//auth
const auth = require("./Auth/Auth");

const app = express();
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//connextion
require("../db");

//Schema imported registration collections
const User = require("./model/user_register");
const Owner = require("./model/ownerRegister");
const feedback = require("./model/feedbackSchema");
const deal = require("./model/dealSchema");


//port address setup
const port = process.env.PORT || 3000;

app.use(express.json());

//register a user
app.post("/api/user-reg", async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
        return res.status(422).json({ error: "Please enter all fields" })
    }
    try {
        userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "already exist" });
        }else{
            const user = new User({ name, email, phone, password });
            await user.save();
            res.status(200).json(user);
        }
    } catch {
        res.status("400").json(reg);
    }
})


//register a owner 
app.post("/api/ownerRegister", async (req, res) => {
    const { name, email, gender, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
        return res.status(422).json({ error: "wrong details" })
    }
    try {
        const ownerExist = await Owner.findOne({ email: email })
        if (ownerExist) {
            return res.status(422).json({ error: "already exist" })
        }
        const owner = new Owner({ name, email, password, gender, phone });
        await owner.save();
        res.status(200).json(owner);
    } catch (err) {
        console.log(err);
    }
});


//owner login in website
app.post("/api/ownerLogin",auth, async (req, res) => {
    try {
        let token;  
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "please enter valid details" });
        }
        let ownerLogin = await Owner.findOne({ email: email });

        if (ownerLogin) {
            const checkPassword = await bcrypt.compare(password, ownerLogin.password);
            token = await ownerLogin.generateAuthToken();
            res.cookie("tereBaapkaTokan",token,{
                expires:new Date(Date.now()+ 3600000),
                httpOnly:true
            })

            if (!checkPassword) {
                res.status(400).json({ error: "enter valid email or password" })
            } else {
                res.json({ msg: "user login successfully" })
            }
            console.log(token);
        }
    } catch (err) {
        console.log(err)
    }

})


//display owner details on anywhere 
app.get("/api/ownerDisplay", async (req, res) => {
    const ownerD = await Owner.find();
    try {
        if (!ownerD) throw Error("something wrong")
        res.status("200").json(ownerD);
    } catch {
        res.status("400").json(ownerD);
    }
})

//fedback from which owner 
app.post("/api/feedback",auth,async(req,res)=>{
    const {email,comment} = req.body;
    try{
        const feedbacks = new feedback({
            email,
            comment,
            owner:req.user._id
        })
       const feedbacksave = await feedbacks.save();
        res.json(feedbacksave);
    }catch{
        res.status(401).json({msg: "error"});
    }
})

//display feedback
app.get("/api/feedbackDisplay", async (req, res) => {
    const feedbacD = await feedback.find();
    try {
        if (!feedbacD) throw Error("something wrong")
        res.status("200").json(feedbacD);
    } catch {
        res.status("400").json(feedbacD);
    }
})

//total deals will display
//display feedback
app.get("/api/dealDisplay", async (req, res) => {
    const dealSave = await deal.find();
    try {
        if (!dealSave) throw Error("something wrong")
        res.status("200").json(dealSave);
    } catch {
        res.status("400").json(dealSave);
    }
})

//delete owners api
app.delete("/api/deleteOwner/:id", async function (req, res) {
    Owner.deleteOne({_id:req.params.id}).then((res)=>{
        res.status(200)
    }).catch(
        res.status(400)
    )
})

app.listen(port, () => {
    console.log("port success")
})