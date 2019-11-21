// const graphql = require('graphql') ;
// const {graphQlObjectType , graphQlString,graphQlSchema} = graphql ;
// const_ = require('lodash')
// let books = [{
//     name : 'gagan',genre : 'afdgsa',id :'1',
//     name : 'ram',genre : 'hbfefhfkfj',id :'2'
// }]

// const bookType = new graphQlObjectType({
//     name : 'Book',
//     feilds : ()=>({
//         id : {type: graphQlString},
//         name : {type : graphQlString},
//         genre : {type : graphQlString}
//     })
// })
// const rootQuery = new graphQlObjectType({
//     name : 'rootQueryType',
//     feilds : {
//         book : {
//             type : bookType,
//             args : {id : {type : graphQlString}},
//             resolve(parent,args){

//             }
//         }
//     }
// })

// function book(id){
//     name,
//     genre
// }


// module.exports = new graphQlSchema({
//     query : rootQuery
// })