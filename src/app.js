require('dotenv').config()

const express = require("express");
const cors = require('cors');
const { check, validationResult } = require("express-validator")

// //auth
// const auth = require("./Auth/middleware");

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
const shailuKiDeal = require("./model/dealSchema");
const Allproperty = require("./model/allproperty")
const package = require("./model/packages");
const category = require("./model/category");
const subcategory = require("./model/subcategory");
const city = require("./model/city");
const state = require("./model/state");
const admin = require("./model/adminData");
const inqueryProp = require("./model/inquiery");
const reviewData = require("./model/reviewSchema");
const inqueryResponse = require('./model/inqueryResponse');
//port address setup
const port = process.env.PORT || 3000;

app.use(express.json());

const cloudinary = require("cloudinary");






//display user their deals
app.get('/api/searchbycategory/:category', async (req, res) => {
    const category = req.params.category
    const searchbycategory = await Allproperty.find({ category: category });
    try {
        if (!searchbycategory) throw Error("something wrong")
        res.status(200).json(searchbycategory);
    } catch {
        // console.error(searchbycategory);
        res.status(500).json(searchbycategory);
    }
})

//display user their deals
app.get('/api/searchuserDeals/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail
    const searchuserdeal = await shailuKiDeal.find({ userEmail: userEmail });
    try {
        if (!searchuserdeal) throw Error("something wrong")
        res.status(200).json(searchuserdeal);
    } catch {
        // console.error(searchuserdeal);
        res.status(500).json(searchuserdeal);
    }
})

//all deal display
app.get("/api/dealdisplayall/patil", async (req, res) => {
    const propertyDeal = await shailuKiDeal.find();
    try {
        if (!propertyDeal) throw Error("something wrong")
        res.status("200").json(propertyDeal);
    } catch {
        res.status("400").json(propertyDeal);
    }
})

//all propertys deal by owner
app.get("/api/dealDisplayForOwner/:ownerID", async (req, res) => {

    const ownerID = req.params.ownerID;
    const findinqueryDisplay = await shailuKiDeal.find({ ownerID: ownerID })
    try {
        res.status("200").json(findinqueryDisplay);
        if (!findinqueryDisplay) throw Error("something wrong")
    } catch {
        res.status("400").json(findinqueryDisplay);
    }
})

// property data update 
app.put("/api/updatepropertyp/:id/details", async function (req, res) {
    try {
        const id = req.params.id
        const PropertyName = req.body.PropertyName
        const FullAddress = req.body.FullAddress
        const description = req.body.description
        const Price = req.body.Price
        const No_of_Floors = req.body.No_of_Floors
        const No_of_Rooms = req.body.No_of_Rooms
        const No_of_BeedRoom = req.body.No_of_BeedRoom
        const No_of_Garage = req.body.No_of_Garage
        const No_of_Bathroom = req.body.No_of_Bathroom
        const No_of_Living_Room = req.body.No_of_Living_Room
        const City = req.body.City
        const builtyear = req.body.builtyear
        const category = req.body.category
        const kitchen = req.body.kitchen
        const sqrft = req.body.sqrft
        const location = req.body.location
        const Images = req.body.Images

        Allproperty.findByIdAndUpdate({ _id: id }, { Images, kitchen, sqrft, location, PropertyName, FullAddress, description, Price, No_of_Floors, No_of_Rooms, No_of_BeedRoom, No_of_Garage, No_of_Bathroom, No_of_Living_Room, City, builtyear, category })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully updated");
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'failed to update'
        })
    }
})

//update package 
app.put("/api/updatePackage/:id/details", async function (req, res) {
    try {
        const id = req.params.id
        const name = req.body.name
        const duration = req.body.duration
        const no_of_ads = req.body.no_of_ads
        const amount = req.body.amount
        const description = req.body.description

        package.findByIdAndUpdate({ _id: id }, { name, duration, no_of_ads, amount, description })
        res.status(200).send("successfully upadated");
    } catch (err) {
    
            res.status(500).send("server error")
    }
})



//deal completed
app.put("/api/dealActivate/:id/isActivated", async function (req, res) {
    try {
        const id = req.params.id
        inqueryResponse.findByIdAndUpdate({ _id: id }, { isCompleted: true })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully activated")
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'Invalid owner'
        })
    }
})

//deal completed
app.put("/api/dealActivated/:id/isCompleted", async function (req, res) {
    try {
        const id = req.params.id
        inqueryProp.findByIdAndUpdate({ _id: id }, { isCompleted: true })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully activated")
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'Invalid owner'
        })
    }
})



//deal completed
app.post("/api/insertDealWithLove/Shailu", async (req, res) => {
    const { ownerName, userEmail, amount, propertyId, ownerID } = req.body;
    try {
        const shailuLove = new shailuKiDeal({
            ownerID,
            ownerName,
            userEmail,
            amount,
            propertyId
        });
        // console.log(ownerName);
        await shailuLove.save();
        res.status(200).send(shailuLove);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});



// inquery property
app.post("/api/insertResponse", async (req, res) => {
    const { userEmail, message, ownerID, ownerName, amount, propertyId, inqueryID } = req.body;
    try {
        const insertResponse = new inqueryResponse({
            userEmail, message, ownerID, ownerName, amount, propertyId, inqueryID
        })
        await insertResponse.save();
        res.status(200).json("successfully inserted");
    } catch {
        res.status(400).json("server error");
    }
})

//config 
cloudinary.config({
    cloud_name: 'ddd37gooh',
    api_key: '412574992491613',
    api_secret: 'Yt-M7Ci-gwQ61h8RL2RICxUNZ6A'
});


app.post("/api/uploadFile", async (req, res) => {
    let result = await cloudinary.uploader.upload(req.body.image, {
        public_id: `${Date.now()}`,
        resource_type: 'auto'
    })
    res.json({
        public_id: result.public_id,
        url: result.secure_url
    })
})

// insert a property
app.post("/api/insertpropertyData/Patil", async (req, res) => {
    // const ownerID = req.params.id;
    const { OwnerName, PropertyName, FullAddress, Images, description, Price, No_of_Floors, No_of_Rooms, No_of_BeedRoom, No_of_Garage, No_of_Bathroom, No_of_Living_Room, City, ownerID, builtyear, sqrft, category,location } = req.body;
    try {
        const AddProperty = new Allproperty({
            OwnerName, PropertyName, FullAddress, Images, description, Price, No_of_Floors, No_of_Rooms, No_of_BeedRoom, No_of_Garage, No_of_Bathroom, No_of_Living_Room, City, ownerID, builtyear, sqrft, category,location    
        });
        // console.log(Images)/
        await AddProperty.save();
        res.status(200).send(AddProperty);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//display owner theri review
app.get('/api/ownerDisplayReview/:ownerID', async (req, res) => {
    const ownerID = req.params.ownerID
    const searchWho = await reviewData.find({ ownerID: ownerID });
    try {
        if (!searchWho) throw Error("something wrong")
        res.status(200).json(searchWho);
    } catch {
        console.error(searchWho);
        res.status(500).json(searchWho);
    }
})


///command add
app.post("/api/commentadd", async (req, res) => {
    const { comment, ownerID, userName, propertyId } = req.body;
    try {
        const commentadd = new reviewData({
            comment,
            ownerID: ownerID,
            userName,
            propertyId
        });
        await commentadd.save();
        res.status(200).send("successfully inserted");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
});

//delete property
app.delete("/api/deleteproperty/:id", async function (req, res) {
    const id = req.params.id
    const deleteproperty = await Allproperty.findByIdAndDelete({ _id: id });
    try {
        if (!deleteproperty) {
            res.status("400").json(deleteproperty);
        }
        res.send(deleteproperty);
    } catch {
        res.status("400").json(deleteproperty);
    }
})


//delete review
app.delete("/api/deletereview/:id", async function (req, res) {
    const id = req.params.id
    const deletereview = await reviewData.findByIdAndDelete({ _id: id });
    try {
        if (!deletereview) {
            res.status("400").json(deletereview);
        }
        res.send(deletereview);
    } catch {
        res.status("400").json(deletereview);
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





//all propertys display by owner
app.get("/api/propertyDisplayForOwner/:ownerID", async (req, res) => {

    const ownerID = req.params.ownerID;
    const propertyDispby = await Allproperty.find({ ownerID: ownerID });
    try {
        if (!propertyDispby) throw Error("something wrong")
        res.status("200").json(propertyDispby);
    } catch {
        res.status("400").json(propertyDispby);
    }
})

//all propertys display by owner
app.get("/api/propertyDisplayForOwner/:ownerID", async (req, res) => {

    const ownerID = req.params.ownerID;
    const propertyDispby = await Allproperty.find({ ownerID: ownerID });
    try {
        if (!propertyDispby) throw Error("something wrong")
        res.status("200").json(propertyDispby);
    } catch {
        res.status("400").json(propertyDispby);
    }
})

//all deals display by owner
app.get("/api/ownerFind/:ownerID", async (req, res) => {

    const id = req.params.ownerID;
    const ownerFind = await Owner.find({ _id: id });
    try {
        if (!ownerFind) throw Error("something wrong")
        res.status("200").json(ownerFind);
    } catch {
        res.status("400").json(ownerFind);
    }
})

//display user their response
app.get('/api/searchuserEmail/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail
    const searchuserEmail = await inqueryResponse.find({ userEmail: userEmail });
    try {
        if (!searchuserEmail) throw Error("something wrong")
        res.status(200).json(searchuserEmail);
    } catch {
        // console.error(searchuserEmail);
        res.status(500).json(searchuserEmail);
    }
})





//display property by id
app.get("/api/reviewByItId/:id", async (req, res) => {
    const id = req.params.id;
    const displayDataProperty = await reviewData.find({ propertyId: id });
    try {
        if (!displayDataProperty) throw Error("something wrong")
        res.status("200").json(displayDataProperty);
    } catch {
        res.status("400").json(displayDataProperty);
    }
})

//// inqueryProp//all propertys display by owner
app.get("/api/propertyinqueryForOwner/:ownerID", async (req, res) => {

    const ownerID = req.params.ownerID;
    const findinqueryD = await inqueryProp.find({ ownerID: ownerID })
    try {
        res.status("200").json(findinqueryD);
        if (!findinqueryD) throw Error("something wrong")
    } catch {
        res.status("400").json(findinqueryD);
    }
})





//register a admin 
app.post("/api/adminRegister", async (req, res) => {
    const { email, password } = req.body;
    try {
        let adminss = await admin.findOne({ email });
        if (adminss) {
            return res.status(422).json({ error: "email is already exist" })
        }
        const adminData = new admin({
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        adminData.password = await bcrypt.hash(password, salt);
        await adminData.save();

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});
//fedback from which owner 
app.post("/api/feedbackssadd", async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const feedbackadd = new feedback({
            name, email, message
        });
        await feedbackadd.save();
        res.status(200).send("successfully inserted");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
});

//login a owner 
app.post("/api/AdminLogin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const adminLog = await admin.findOne({ email });
        if (!adminLog) {
            return res.status(422).json({ error: "envalid data" })
        }
        const checkpassw = await bcrypt.compare(password, adminLog.password);
        if (!checkpassw) {
            return res.status(422).json({ error: "envalid data pass" })
        }
        const payload = {
            adminLog: {
                id: adminLog.id
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

//login a user
app.post("/api/userLogin", async (req, res) => {
    const { email, password } = req.body;


    try {
        let userLogin = await User.findOne({ email });
        if (!userLogin) {
            return res.status(422).json({ error: "envalid data" })
        }

        const checkpass = await bcrypt.compare(password, userLogin.password);
        if (!checkpass) {
            return res.status(422).json({ error: "envalid data" })
        }

        const payload = {
            userLogin: {
                Fname: userLogin.Fname,
                email: userLogin.email
            }
        }

        jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token, payload });
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//update password owner
app.put("/api/updatepOwner/:ownerID/details", async function (req, res) {
    try {
        const ownerID = req.params.ownerID
        const password = req.body.password

        Owner.findByIdAndUpdate({ _id: ownerID }, { password: password })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully updated")
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'failed to update'
        })
    }
})


//register a user
app.post("/api/user-reg", async (req, res) => {
    const { Fname, Lname, email, phone, password } = req.body;
    try {
        userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(422).json({ error: "Email is already exist" });
        } else {
            const user = new User({ Fname, Lname, email, phone, password });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            res.status(200).json(user);
        }
    } catch {
        res.status("400").json(reg);
    }
})


//register a owner 
app.post("/api/ownerRegister", async (req, res) => {
    const { names, email, phone, password } = req.body;
    try {
        let owner = await Owner.findOne({ email });
        if (owner) {
            return res.status(422).json({ error: "email is already exist" })
        }
        const ownerData = new Owner({
            names,
            email,
            password,
            phone,
        });
        await ownerData.save();

        const payload = {
            ownerData: {
                id: ownerData.id
            }
        }
        const user = {
            id: ownerData._id
        }

        jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token, user })
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//insert property
app.post("/api/insertcategory", async (req, res) => {
    const { name } = req.body;
    try {
        const categorys = await category.findOne({ name });
        if (categorys) {
            return res.status(422).json({ error: "category is already exist" })
        } else {
            const categoryAdd = new category({
                name
            })
            await categoryAdd.save();
            res.status(200).send('successfully inserted');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//insert subcategory
app.post("/api/subcategoryadd", async (req, res) => {
    const { names } = req.body;
    try {
        const subcategorys = await subcategory.findOne({ names });
        if (subcategorys) {
            return res.status(422).json({ error: "sub category is already exist" })
        } else {
            const subcategoryadd = new subcategory({
                names
            });
            await subcategoryadd.save();
            res.status(200).send("successfully inserted");
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})


//display
app.get("/api/categoryDisplay", async (req, res) => {
    const categorysfind = await category.find();
    try {
        if (!categorysfind) throw Error("something wrong")
        res.status("200").json(categorysfind);
    } catch {
        res.status("400").json(categorysfind);
    }
})

//delete category
app.delete("/api/deleteOcategory/:id", async function (req, res) {
    try {
        const deletecategory = await category.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletecategory);
        }
        res.send("successfully deleted");
    } catch {
        res.status("400").json(deletecategory);
    }
})

//login a owner 
app.post("/api/ownerLogin", async (req, res) => {
    const { email, password } = req.body;
    try {
        let owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(422).json({ error: "envalid data" })
        } else {
            const checkpass = await Owner.findOne({ password });
            if (!checkpass) {
                return res.status(422).json({ error: "envalid password" })
            }
        }
        const payload = {
            owner: {
                id: owner.id
            }
        }

        const data = {
            id: owner.id,
            status: owner.status,
            name: owner.names
        }

        jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ data, token })
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});



//all state display
app.get("/api/statedisp", async (req, res) => {
    const statecat = await state.find();
    try {
        if (!statecat) throw Error("something wrong")
        res.status("200").json(statecat);
    } catch {
        res.status("400").json(statecat);
    }
})

//dellete state
app.delete("/api/deletestate/:id", async function (req, res) {
    try {
        const deletestate = await state.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletestate);
        }
        res.send(deletestate);
    } catch {
        res.status("400").json(deletestate);
    }
})





//delete city
app.delete("/api/deletecityy/:id", async function (req, res) {
    try {
        const deletecitys = await city.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletecitys);
        }
        res.send(deletecitys);
    } catch {
        res.status("400").json(deletecitys);
    }
})

//all city display
app.get("/api/citydisp", async (req, res) => {
    const citycat = await city.find();
    try {
        if (!citycat) throw Error("something wrong")
        res.status("200").json(citycat);
    } catch {
        res.status("400").json(citycat);
    }
})



//insert city
app.post("/api/cityadd", async (req, res) => {
    const { citys } = req.body;
    try {
        const cityadd = new city({
            citys
        });

        await cityadd.save();

        const body = {
            success: true,
            message: 'successfully inserted',
            error: ''
        }
        res.status("200").send(body);
    } catch (err) {
        console.error(err.message);
        if (err.code == 11000) {
            const body = {
                success: false,
                error: `Duplicate data ${err.keyValue.states}`
            }
            res.status(400).send(body)
        } else {
            res.status(500).send("server error");
        }
    }
});


//all packages manage by admin  
app.post("/api/packageadd", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, duration, no_of_ads, amount, description } = req.body;
    try {
        const packages = new package({
            name,
            duration,
            no_of_ads,
            amount,
            description,
        });
        await packages.save();
        const body = {
            success: true,
            message: 'successfully inserted',
            error: ''
        }
        res.status(200).send(body);
    } catch (err) {
        console.error(err.code);
        if (err.code == 11000) {
            const body = {
                success: false,
                error: `Duplicate data ${err.keyValue.name}`
            }
            res.status(400).send(body)
        } else {
            res.status(500).send("server error");
        }
    }
});

//insert state
app.post("/api/stateadd", async (req, res) => {
    const { states } = req.body;
    try {
        const stateadds = new state({
            states
        });
        await stateadds.save();
        const body = {
            success: true,
            message: 'successfully inserted',
            error: ''
        }
        res.status(200).send(body);
    } catch (err) {
        console.error(err.code);
        if (err.code == 11000) {
            const body = {
                success: false,
                error: `Duplicate data ${err.keyValue.states}`
            }
            res.status(400).send(body)
        } else {
            res.status(500).send("server error");
        }
    }
});


//delete package
app.delete("/api/deletePackage/:_id", async function (req, res) {
    try {
        const deletepackage = await package.findByIdAndDelete(req.params._id);
        if (!req.params._id) {
            res.status("400").json(deletepackage);
        }
        res.send("successfully deleted");
    } catch {
        res.status("400").json(deletepackage);
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





//delete subcategory
app.delete("/api/deletesubcategory/:id", async function (req, res) {
    try {
        const deletesubcategory = await subcategory.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletesubcategory);
        }
        res.send(deletesubcategory);
    } catch {
        res.status("400").json(deletesubcategory);
    }
})

//delete subcategory
app.delete("/api/deletefeedback/:id", async function (req, res) {
    try {
        const deletefeedback = await feedback.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status("400").json(deletefeedback);
        }
        res.send(deletefeedback);
    } catch {
        res.status("400").json(deletefeedback);
    }
})


//insert subcategory
app.post("/api/categoryadd", async (req, res) => {
    const { name } = req.body;
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
        if (!req.params.id) {
            res.status("400").json(deletecategory);
        }
        res.send(deletecategory);
    } catch {
        res.status("400").json(deletecategory);
    }
})

//owner activate
app.put("/api/updateOwner/:id/status", async function (req, res) {
    try {
        const id = req.params.id
        Owner.findByIdAndUpdate({ _id: id }, { status: true })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully activated")
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'Invalid owner'
        })
    }
})
//owner activate
app.put("/api/updateOwnerDetails/:id", async function (req, res) {
    const { transactionID, packageName, amount, no_of_ads } = req.body;
    try {
        const id = req.params.id
        Owner.findByIdAndUpdate({ _id: id }, { transactionID, packageName, amount, no_of_ads })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully activated")
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'Invalid owner'
        })
    }
})

//ropertys single show display
app.get("/api/propertyDisplayForSingle/:_id", async (req, res) => {

    const _id = req.params._id;
    const propertyDispbybySingle = await Allproperty.findOne({ _id: _id });
    try {
        if (!propertyDispbybySingle) throw Error("something wrong")
        res.status("200").json(propertyDispbybySingle);
    } catch {
        res.status("400").json(propertyDispbybySingle);
    }
})


//update password owner
app.put('/api/updatePasswordOwner/:id', async (req, res) => {
    try {
        const id = req.params.id
        const password = req.body.password

        const data = Owner.findByIdAndUpdate({ _id: id }, { password })
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err)
        console.log(err);
    }
})

//update package 
app.put("/api/updateCategory/:id/details", async function (req, res) {
    try {
        const id = req.params.id
        const name = req.body.name

        category.findByIdAndUpdate({ _id: id }, { name })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully updated");
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'failed to update'
        })
    }
})

app.put("/api/updatePackage/:id/details", async function (req, res) {
    try {
        const id = req.params.id
        const name = req.body.name
        const duration = req.body.duration
        const no_of_ads = req.body.no_of_ads
        const amount = req.body.amount
        const description = req.body.description

        package.findByIdAndUpdate({ _id: id }, { name, duration, no_of_ads, amount, description  })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully updated")
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'failed to update'
        })
    }
})

//update subcategory
app.put("/api/updateSubCategory/:id/details", async function (req, res) {
    try {
        const id = req.params.id
        const names = req.body.names
        const category = req.body.category

        subcategory.findByIdAndUpdate({ _id: id }, { names, category })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully updated")
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'failed to update'
        })
    }
})

//update state
app.put("/api/updateState/:id/details", async function (req, res) {
    try {
        const id = req.params.id
        const states = req.body.states
        const country = req.body.country

        state.findByIdAndUpdate({ _id: id }, { states, country })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully updated")
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'failed to update'
        })
    }
})

//update city
app.put("/api/updateCity/:id/details", async function (req, res) {
    try {
        const id = req.params.id
        const citys = req.body.citys

        city.findByIdAndUpdate({ _id: id }, { citys })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully updated")
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'failed to update'
        })
    }
})


//owner activate
app.put("/api/deactivateOwner/:id/status", async function (req, res) {
    try {
        const id = req.params.id
        Owner.findByIdAndUpdate({ _id: id }, { status: false })
            .exec((err, result) => {
                if (err) return console.log(err)
                res.json("successfully deactivated")
            })
    } catch (err) {
        console.log(err)
        res.json({
            err: 'Invalid owner'
        })
    }
})



//all propertys display by owner
app.get("/api/propertyDisplayOwner/:ownerID", async (req, res) => {

    const ownerID = req.params.ownerID;
    const ownerDisplayData = await Owner.find({ _id: ownerID });
    try {
        if (!ownerDisplayData) throw Error("something wrong")
        res.status("200").json(ownerDisplayData);
    } catch {
        res.status("400").json(ownerDisplayData);
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
        if (!req.params.id) {
            res.status("400").json(deletepackage);
        }
        res.send("successfully deleted");
    } catch {
        res.status("400").json(deletepackage);
    }
})

//inquery property
app.post("/api/inqueryProperty", async (req, res) => {
    const { userEmail, userName, amount, message, phone, ownerID, propertyId } = req.body;
    try {
        const insertData = new inqueryProp({
            userEmail, userName, amount, message, phone, ownerID, propertyId
        })
        await insertData.save();
        res.status(200).json("successfully inserted");
    } catch {
        res.status(400).json("server error");
    }
})





//total inquiery will display
app.get("/api/inquiryDisplay", async (req, res) => {
    const dealInquery = await inqueryProp.find();
    try {
        if (!dealInquery) throw Error("something wrong")
        res.status("200").json(dealInquery);
    } catch {
        res.status("400").json(dealInquery);
    }
})

//find by id for property
app.get("/api/propertyShow", async (req, res) => {
    const findPropertyByUser = new inqueryProp.findById({ userID });
    try {
        if (!findPropertyByUser) throw Error("something wrong");
        res.status(200).json(findPropertyByUser);
    } catch {
        res.status(400).json("server error");
    }
})

app.listen(port, () => {
    console.log("port success")
})