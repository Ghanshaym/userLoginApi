const Joi = require('joi');
let services = {}
const userModel = require('../models/models')
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let controllers = require('../controller/controllers')
let nodemailer = require('nodemailer')
let USER_DATA_EMAIL_LINK_ = require('../config/server')

services.schemaData = (req, res) => {
  let schema = Joi.object().keys({
    firstName: Joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
    lastName: Joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
    email: Joi.string().email({ minDomainAtoms: 1 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    role: Joi.string().regex(/^[a-zA-Z_]{3,30}$/).min(3).max(30).required()
  });
  return schema;
}

services.userSevedata = (request, response) => {

  let userData = request;

  userData.save((err, value) => {

    if (err) {
      let responce = {
        message: "your data will not saved",
        statusCode: 400,
        data: err
      }

      response.json(responce)
    }
    else if (value) {
      let responce = {
        message: "your data will be saved",
        statusCode: 200,
        data: value
      }
      response.json(responce);
    }

  })
}

services.getUser = async (request, response) => {

  let sortData = await userModel.find().sort({ firstName: 1 }).skip(request.index).limit(request.limit);
  let responce = {
    message: "Fetched user data",
    statusCode: 200,
    data: sortData
  }
  response.json(responce);

}

services.getUserById = async (request, response) => {
  
  let getData = await userModel.findById(request.param).lean();

  if (getData.role == 'admin' || getData.role == 'normal_user') {

    let responce = {
      message: "fetched  user",
      statusCode: 200,
      data: getData
    };
    response.json(responce);
  }
  else {
    let responce = {
      message: "role of the user has been missing",
      statusCode: 400
    }
    response.json(responce);
  }
}

services.updateUser = async (req, res, requestuserData) => {

  let findUser = await userModel.findById(req.params)

  let updateData = await userModel.findByIdAndUpdate(req.param, { $set: requestuserData });

  let response = {
    message: "your data will be update",
    statusCode: 200,
    data: updateData
  }
  res.json(response);

}

services.deleteUser = async (request, response) => {
  let findUser = await userModel.findById(request.param)

  let deleteUserData = await userModel.findByIdAndDelete(request.param);

  let responce = {
    message: "user data has been deleted",
    satausCode: 200,
    data: deleteUserData
  }
  response.json(responce);
}

services.logIn = async (request, response) => {


  let personInfo = await userModel.findOne({ email: request.email });
  bcrypt.compare(request.password, personInfo.password, function (err, same) {

    if (same) {
      const token = jwt.sign({
        email: personInfo.email,
        _id: personInfo._id,
        role: personInfo.role
      }, 'secret');
      let responce = {
        message: "Loged In successfully",
        statusCode: 200,
        token: token
      }
      response.json(responce)
    }
    else {
      let responseData = {
        message: "your email and password does not match",
        satausCode: 400
      }
      response.json(responseData);
    }
  })

}

services.resetPassword = async (request, response) => {
  console.log("Enter in reset Password");

}

services.forgotPassword = async (request, response) => {

  let resetToken = jwt.sign({
    email: request.email,
    _id: request._id0
  }, 'secret',{
    expiresIn: 60
  });

  let obj = resetToken ; 
  await request.save();
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER_DATA_EMAIL_LINK_.USER_EMAIL,
      pass: USER_DATA_EMAIL_LINK_.USER_PASSWORD
    }
  });
  let mailOptions = {
    from: "poonergagan@gmail.com",
    to: "gaganchoudhary658@gmail.com", // list of receivers
    subject: "Reset_Password_Link", // Subject line
    html: '<p>Click <a href="http://localhost:3000/resetPassword/' + obj + '">here</a> to reset your password</p>' // plain text body
  };
  let info = await transporter.sendMail(mailOptions, (err, value) => {
    if (err) {

    
      response.send(err)
    }
    response.send(value);
  });
}
services.changePassword = async (request, response, passwordPayload) => {

  passwordUpdate = bcrypt.hashSync(passwordPayload, 2)
  let updatePassword = await userModel.updateMany({ password: request.password }, { $set: { password: passwordUpdate } })
  console.log('update password' + updatePassword);
  let responce = {
    statusCode: 200,
    message: "your password will be update",
    email: request.email
  }
  response.json(responce);
}


module.exports = services;