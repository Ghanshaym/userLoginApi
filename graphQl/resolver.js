const model = require('../models/models')
module.exports = {
 createUser : async ({userInput,res})=>{
    // const existingUser = await model.findOne({email : userInput.email})
    const user = {
        email : userInput.email,
        firstName : userInput.firstName,
        lastName : userInput.lastName,
        password : userInput.password,
        role : userInput.role
    }
    console.log('user?????????',user);
    let saveUserData = new model(user);
    saveUserData.save((err,match)=>{
        console.log('error',err);
        console.log('match',match); 
    })
    // const createUser = await user.save((err,match)=>{
    //     console.log('err',err);
    //     console.log('match',match);
        
    // })
    // console.log('create user',createUser);
    
    return {_id : saveUserData.id.toString(),email: saveUserData.email}
 },
 login : async ({email,password})=>{
     console.log('email will be',email);
     
     const user = await model.findOne({email:email})
     
     console.log('???????????????????????????',user);
     
     return {userId : user.id.toString()}
 }
}




// mutation{
//     createUser(userInput:{email:"hghghg123345@gamil.com",firstName:"gagan",lastName:"kumar",password:"sagffasg",role:"Admin"})
//     {
//       email
//     }
//   }