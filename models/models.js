const mongoose  = require('mongoose');
mongoose.connect('mongodb://anchal:anchal123@ds259802.mlab.com:59802/nextpagetest', { useUnifiedTopology: true, useNewUrlParser: true }  );

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