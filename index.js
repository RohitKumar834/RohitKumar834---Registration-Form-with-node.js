const express = require("express");
const mongoose =require("mongoose");
const bodyParser = require("body-parser");
const dotenv =require("dotenv");
//require('dotenv').config();

const  app = express();
dotenv.config();

const port =process.env.PORT || 3000;
const username=process.env.MONGOOB_USERNAME;
const password=process.env.MONGOOB_PASSWORD;

//mongoose connection

mongoose.connect(`mongodb+srv://${username}:${password}@cluster1.rcpbsvm.mongodb.net/registrationDB`, {
    //useNewUrlIParser:true,
    //useUnifiedTopology :true,
})
//Registration schema
const registrationSchema = new mongoose.Schema({
    nmare: String,
    email : String,
    password : String
});

//model of registration Schema
const Registration =mongoose.model("Registration", registrationSchema);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//get request handler
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/pages/index.html");
})

//post request handler

app.post("/register", async(req, res)=>{
    try{
        const {name, email, password} =req.body;
        const existingUser = await Registration.findOne({email : email});
        if(!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password
            });
           await registrationData.save();
           res.redirect("/success");
        }
        else{
            console.log("User already exist");
            res.redirect("/error");
        }
        
    }catch(error){
        console.log(error);
        res.redirect("error");
    }
})


app.get("/success",(req, res)=>{
    res.sendFile(__dirname +"/pages/success.html")
})

app.get("/error",(req, res)=>{
    res.sendFile(__dirname +"/pages/error.html")
})
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})