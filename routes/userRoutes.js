const controller = require('../controller/controllers');
const middleware = require('../middleware/middlewares');


module.exports = (app) => {

    app.route('/signup').get(controller.getSignUp)
    app.route('/signup').post(middleware.signup, controller.signUp)
    app.route('/signin').get(controller.signIn)
    app.route('/signin').post(controller.logIn)
    app.route('/forgotPassword').post(middleware.forgotPassword, controller.emailLink)
    app.route('/resetPassword/:resetToken').get(middleware.resetPassword, controller.resetPassword)
    app.route('/changePassword').post(middleware.checkToken, controller.changePassword)
    app.route('/user').get(middleware.payload, middleware.userJwtAuthencation, controller.getuser)
    app.route('/user/:id').get(middleware.payload, middleware.userJwtAuthencation, controller.getUserById)
    app.route('/user/:id').put(middleware.payload, middleware.adminJwtAuthencation, controller.updateUser)
    app.route('/user/:id').delete(middleware.payload, middleware.adminJwtAuthencation, controller.deleteUser)
    app.route('/me/delete').post(middleware.deleteMe)
    app.route('/me/deleteConfirmation').post(middleware.test)
}


