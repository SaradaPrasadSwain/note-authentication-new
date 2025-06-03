const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const path = require('path');
const {userModel} = require('./db');
const {notesModel} = require('./db');

const secretKey = 'sarada12345';
const app = express();
app.use(cookieParser())
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
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.redirect("/notes");
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

app.post("/notes", authenticate, async function(req, res){
    const userId = req.userId;
    const data = req.body.data;
    const oneNote = await notesModel.create({
        userId,
        data
    });
    res.json({
        success: true,
        noteId: oneNote._id
    });
})

// app.delete("/notes/:id", authenticate, async function(req, res){
//     const noteId = req.params.id;
//     const userId = req.userId;
//     const deleteNote = await notesModel.findOneAndDelete({
//         _id: noteId,
//         userId: userId
//     });
//     res.json({
//         success: true
//     });
// });



app.delete("/notes/:id", authenticate, async function(req, res){
    const noteId = req.params.id;
    const userId = req.userId;
    const deleteNote = await notesModel.findOneAndDelete({
        _id: noteId,
        userId: userId
    });
    res.json({
        success: true
    })
})

app.get("/notes", authenticate,async function(req, res){
    const userId = req.userId;
    const notesData = await notesModel.find({
        userId
    })
    if(notesData){
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
})

app.get("/api/notes", authenticate, async function(req, res){
    const userId = req.userId;
    const notesData = await notesModel.find({userId})
    if(notesData){
        res.json(notesData);
    }else{
        res.status(403).json({
            message: "can't fetch the notesData"
        })
    }
})


function authenticate(req, res, next){
    try{
        const token = req.cookies.token;
        const decodedData = jwt.verify(token, secretKey);
        
        req.userId = decodedData.id;
        next();
    }catch(error) {
        res.status(403).json({
            message: "incorrect token details"
        })
    }
}

app.get("/logout", function(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
})

app.listen(port, ()=>{
    console.log(`The app is running on ${port}`);
});

