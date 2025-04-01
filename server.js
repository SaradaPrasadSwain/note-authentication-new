const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const {userModel} = require('./db');
const {notesModel} = require('./db');

const secretKey = 'sarada12345';
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = 3000;
mongoose.connect('mongodb+srv://somanath2486:6371048294%40mongodb@cluster0.u8i2a.mongodb.net/hatiKaBacha');


app.use("/", express.static(path.join(__dirname, 'public')));
app.use("/home", express.static(path.join(__dirname, 'public')));
app.post("/register", async function(req, res){
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        await userModel.create({
            name : name,
            email : email,
            password : password
        });
        res.redirect("/login")
    }catch(error){
        res.status(403).json({
            message: "Error occurring during signup"
        })
    }
    
})

app.post("/login", async function(req, res){
    const email = req.body.email;
    const password = req.body.password

    const user = await userModel.findOne({
        email: email,
        password: password
    })
    if(user){
        const token = jwt.sign({id: user._id}, secretKey)
        res.redirect("/");
    }else{
        res.status(403).json({
            message: "Error occurred"
        })
    }
    
})

app.get("/register", function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'login', 'signUp.html'))
})

app.get("/login", function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'))
})

app.post("/notes", authenticate, function(req, res){

})


app.get("/notes", authenticate, function(req, res){

})

function authenticate(req, res, next){
    const token = req.headers['authorization'];
    const decodedData = jwt.verify(token, 'secretKey');
    if(decodedData){
        req.userId = decodedData.id;
        next();
    }else{
        res.status(403).json({
            message: "incorrect token details"
        })
    }
}


app.listen(port, ()=>{
    console.log(`The app is running on ${port}`);
});