let jwt = require('jsonwebtoken');
let Enum = require('enum');
const bcrypt = require('bcrypt');
const userModel = require('../models/models')
let middleware = {}
const checkValidation = require('../config/serverCrash')

middleware.signup = (request, response, next) => {

    let enumRole = new Enum({ normalUser: 'normal_user', admin: 'admin' });
    let userData = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        password: request.body.password,
        role: request.body.role
    }


    if (userData.role != enumRole.normalUser && userData.role != enumRole.admin) {

        let responce = {
            message: "you are missign the role key",
            satausCode: 400
        }
        response.json(responce);
    }
    if (userData.firstName && userData.lastName && userData.email && userData.password && userData.role == null) {
        let response = {
            message: " All fields are not entered ",
            satausCode: 400,
            data: userData
        }
        response.json(responce)
    }
    else {
        request.value = userData;

        next()
    }
}

middleware.payload = (request, response, next) => {

    let pagnation = {
        index: Number(request.query.index),
        limit: Number(request.query.limit),
        headers: request.headers.authorization,
        param: request.params.id,
        password: request.body.password
    }

    if (pagnation.headers == null) {
        let responce = {
            message: "plaese enter the valid tokens",
            satausCode: 400
        }
        response.json(responce);
    }
    else {
        request.paginationValue = pagnation
        next()
    }

}

middleware.userJwtAuthencation = async (request, response, next) => {


    let token = request.paginationValue.headers;
    let decode = jwt.verify(token, "secret");
    let user = await userModel.findOne({  });
    if (user && user.role != 'normal_user' && user.role != 'admin') {
        let responce = {
            satausCode: 401,
            message: "  unauthorized access because your role field is missing  "
        }
        response.json(responce)
    }
    else {
        request.user = user;
        next();
    }

}

middleware.adminJwtAuthencation = async (request, response, next) => {

    let token = request.paginationValue.headers;
    let decode = jwt.verify(token, "secret");
    let user = await userModel.findOne({ "email": decode.email });
    if (user && user.role != 'admin') {
        let responce = {
            satausCode: 401,
            message: " unauthorized access because you are not admin "
        }
        response.json(responce)
    }
    else {
        request.user = user;
        next();
    }
}

middleware.resetPassword = async (request, response, next) => {

    if (request.params == undefined) {
        let userResponseData = {
            statusCode: 200,
            message: 'Enter the valid token'
        }
        response.json(userResponseData);
    }
    JSON.stringify(request.params.resetToken);
    let decode = await jwt.verify(request.params.resetToken, 'secret', (err, userVerfiedToken) => {
        if (err) {
            let userResponseData = {
                statusCode: 400,
                message: 'your link will expire'
            }
            return response.json(userResponseData);
        }
        else {
            return userVerfiedToken;
        }
    });

    let user = await userModel.findOne({ email: decode.email });
    if (user != null) {

        request.data = user;
        next()
    }

}

middleware.forgotPassword = async (request, response, next) => {
    let user = await userModel.findOne({ email: request.body.email })
    if (user == null) {
        let responce = {
            statusCode: "200",
            message: "please enter the valid email"
        }
        response.json(responce);
    }
    request.userData = user;
    next()
}

middleware.checkToken = async (request, response, next) => {
    let obj = request.headers.referer.slice(36, 500);
    decode = jwt.verify(obj, 'secret');
    let user = await userModel.findOne({ email: decode.email })

    if (request.body.newPassword != request.body.confirmPassword) {
        let responce = {
            satausCode: 400,
            message: "you newPassword and confirmPassword does not match"
        }
        response.json(responce);
    } else {
        request.data = user;
        next()
    }
}

middleware.deleteMe = async (request, response) => {

    if (request.body.email == '' || request.body.password == '' || request.obj == null) {
        let userResponseData = {
            statusCode: 400,
            message: "please enter the valid data"
        }
        return response.json(userResponseData);

    }
    let personInfo = await userModel.findOne({ email: request.body.email });
    if (personInfo == null && request.body.email && request.body.password) {
        let userResponseData = {
            statusCode: 400,
            message: "please check your email"
        }
        return response.json(userResponseData);
    }
    bcrypt.compare(request.body.password, personInfo.password, function (err, same) {

        if (same) {
            const token = jwt.sign({
                email: personInfo.email,
                _id: personInfo._id,
                role: personInfo.role
            }, 'secret');
            personInfo.flag = 1;
            personInfo.save();
            middleware.test(token, response)
        }
        else {
            let userResponseData = {
                message: "your email and password does not match",
                satausCode: 400
            }
            return response.json(userResponseData);
        }
    })

}

middleware.test = async (token, response) => {
    decode = jwt.verify(token, 'secret');
    findUser = await userModel.findOne({ "email": decode.email });
    if (findUser.flag == 1) {
        await userModel.deleteOne(findUser)
        let userResponseData = {
            statusCode: 200,
            message: "your email will be deleted",
            data: findUser
        }
        response.json(userResponseData)
    }

}

module.exports = middleware