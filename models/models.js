const mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userdata', {useNewUrlParser: true});

let personData = new mongoose.Schema({
    firstName : String,
    lastName : String ,
    email : {type: String , unique: true},
    password : String,
    role : String,
    resetPasswordToken: { type: String },
    flag : {type : Number}
})
 module.exports = mongoose.model("personData",personData);
 