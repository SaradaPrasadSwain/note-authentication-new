const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;
const Schema = mongoose.Schema;

const user = new Schema({
    name: String,
    email: String,
    password: String
})

const notes = new Schema({
    data: String,
    userId: ObjectId
})

const userModel = mongoose.model("user", user)
const notesModel = mongoose.model("notes", notes);

module.exports = {
    userModel,
    notesModel
}
