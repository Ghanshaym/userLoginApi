let personData = {};
const userModel = require('../models/models')
const Joi = require('joi');
const service = require('../services/service');
const bcrypt = require('bcrypt');



personData.getSignUp = function (request, response) {
    response.sendFile('signup.html', { root: __dirname });
}

personData.signUp = function (request, response) {
    let userRequestdata = request.value;

    Joi.validate(userRequestdata, service.schemaData(), (err, value) => {


        if (err) {
            let responce = {
                message: "plese fill the all requried fields",
                statusCode: 400,
                data: err
            }
            response.send(responce);
        } else {
            userRequestdata.password = bcrypt.hashSync(userRequestdata.password, 2);
            let saveUserData = new userModel(userRequestdata);
            service.userSevedata(saveUserData, response)
        }
    })
}

personData.signIn = function (request, response) {
    response.sendFile('signin.html', { root: __dirname });
}

personData.logIn = async function (request, response) {

    service.logIn(request.body, response)

}

personData.getuser = async (request, response) => {

    service.getUser(request.paginationValue, response)
}

personData.getUserById = async (request, response) => {

    service.getUserById(request.paginationValue, response)
}

personData.updateUser = async (request, response) => {

    let requestuserData = {
        firstName: request.body.firstName,
        lastName: request.body.lastName
    }
    service.updateUser(request.paginationValue, response, requestuserData)
}

personData.deleteUser = async (request, response) => {

    service.deleteUser(request.paginationValue, response)
}

personData.resetPassword = async (request, response) => {
    let obj = request.data

    response.sendFile('resetPassword.html', { root: __dirname });
}

personData.task = (request, response) => {

    let responce = {
        message: "fetched user",
        statusCode: 200,
        data: request.user
    }
    response.json(responce);
}

personData.emailLink = (request, response) => {

    service.forgotPassword(request.userData, response);

}

personData.changePassword = (request, response, next) => {
    let passwordPayload = request.body.confirmPassword;
    service.changePassword(request.data, response, passwordPayload)

}

module.exports = personData;