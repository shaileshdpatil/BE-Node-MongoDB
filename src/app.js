require('dotenv').config()
const express = require("express");
const cors = require('cors');
var mongodb = require('mongodb');
const { check, validationResult } = require("express-validator")
//auth
const auth = require("./model/auth");


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
const Allproperty = require("./model/allproperty")
const package = require("./model/packages");
const category = require("./model/category");
const subcategory = require("./model/subcategory");


//port address setup
const port = process.env.PORT || 5000;

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
        } else {
            const user = new User({ name, email, phone, password });
            await user.save();
            res.status(200).json(user);
        }
    } catch {
        res.status("400").json(reg);
    }
})


//register a owner 
app.post("/api/ownerRegister", [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('phone', 'phone is required').isLength({ min: 5 }),
    check('password', 'password is required').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, password, gender } = req.body;
    try {
        let owner = await Owner.findOne({ email });
        if (owner) {
            return res.status(422).json({ error: "email is already exist" })
        }
        const ownerData = new Owner({
            name,
            email,
            password,
            phone,
            gender
        });

        const salt = await bcrypt.genSalt(10);
        ownerData.password = await bcrypt.hash(password, salt);
        await ownerData.save();

        const payload = {
            ownerData: {
                id: ownerData.id
            }
        }

        jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token })
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//

//login a owner 
app.post("/api/ownerLogin", [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(422).json({ error: "envalid data" })
        }

        const checkpass = await bcrypt.compare(password, owner.password);
        if (!checkpass) {
            return res.status(422).json({ error: "envalid data" })
        }

        const payload = {
            owner: {
                id: owner.id
            }
        }

        jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token })
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//insert property
app.post("/api/insertproperty", async (req, res) => {
    const { name, type, amount } = req.body;
    try {
        const property = new Allproperty({
            name,
            type,
            amount
        });
        await property.save();
        res.status(200).send("successfully inserted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});
//insert property
app.post("/api/insertcategory", async (req, res) => {
    const { name} = req.body;
    try {
        const categorys = new category({
            name,
        });
        await categorys.save();
        res.status(200).send("successfully inserted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});


//display category
app.get("/api/categoryDisplay", async (req, res) => {
    const categorysfind = await category.find();
    try {
        if (!categorysfind) throw Error("something wrong")
        res.status("200").json(categorysfind);
    } catch {
        res.status("400").json(categorysfind);
    }
})

//all packages manage by admin
app.post("/api/packageadd", async (req, res) => {
    const { name, duration,no_of_ads, amount ,description} = req.body;
    try {
        const packages = new package({
            name,
            duration,
            no_of_ads,
            amount,
            description,
        });
        await packages.save();
        res.status(200).send("successfully inserted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//display package
app.get("/api/packageDisplay", async (req, res) => {
    const pack = await package.find();
    try {
        if (!pack) throw Error("something wrong")
        res.status("200").json(pack);
    } catch {
        res.status("400").json(pack);
    }
})


//delete package
app.delete("/api/deletePackage/:id", async function (req, res) {
    try {
        const deletepackage = await package.findByIdAndDelete(req.params.id);
        if (!req.params.id){
            res.status("400").json(pack);
        }
        res.send("successfully deleted");
    } catch {
        res.status("400").json(pack);
    }
})


//display owner details on any  where 
app.get("/api/ownerDisplay", async (req, res) => {
    const ownerD = await Owner.find();
    try {
        if (!ownerD) throw Error("something wrong")
        res.status("200").json(ownerD);
    } catch {
        res.status("400").json(ownerD);
    }
})


//all propertys display
app.get("/api/propertyDisplay", async (req, res) => {
    const property = await Allproperty.find();
    try {
        if (!property) throw Error("something wrong")
        res.status("200").json(property);
    } catch {
        res.status("400").json(property);
    }
})
//all subcategory display
app.get("/api/subcategorydisp", async (req, res) => {
    const subcat = await subcategory.find();
    try {
        if (!subcat) throw Error("something wrong")
        res.status("200").json(subcat);
    } catch {
        res.status("400").json(subcat);
    }
})


//insert subcategory
app.post("/api/subcategoryadd", async (req, res) => {
    const { names,category} = req.body;
    try {
        const subcategoryadd = new subcategory({
            names,category
        });
        await subcategoryadd.save();
        res.status(200).send("successfully inserted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//insert subcategory
app.post("/api/categoryadd", async (req, res) => {
    const { name} = req.body;
    try {
        const categoryadd = new category({
            name,
        });
        await categoryadd.save();
        res.status(200).send("successfully inserted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});
//delete category api
app.delete("/api/deletcategory/:id", async function (req, res) {
    try {
        const deletecategory = await category.findByIdAndDelete(req.params.id);
        if (!req.params.id){
            res.status("400").json(deletecategory);
        }
        res.send(deletecategory);
    } catch {
        res.status("400").json(deletecategory);
    }
})

//fedback from which owner 
app.post("/api/feedback", auth, async (req, res) => {
    const { email, comment } = req.body;
    try {
        const feedbacks = new feedback({
            email,
            comment,
            owner: req.user._id
        })
        const feedbacksave = await feedbacks.save();
        res.json(feedbacksave);
    } catch {
        res.status(401).json({ msg: "error" });
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
    try {
        const deletepackage = await Owner.findByIdAndDelete(req.params.id);
        if (!req.params.id){
            res.status("400").json(deletepackage);
        }
        res.send("successfully deleted");
    } catch {
        res.status("400").json(deletepackage);
    }
})

app.listen(port, () => {
    console.log("port success")
})