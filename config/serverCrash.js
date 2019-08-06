let serverCrash = {}

serverCrash.checkObject = (requestData, response) => {

    if (requestData.email == '' || requestData.password == '' || requestData.object == null) {
        let userResponseData = {
            statusCode: 400,
            message: "please enter the valid data"
        }
        return response.json(userResponseData);
    }
}
module.exports = serverCrash