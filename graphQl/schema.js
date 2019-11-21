const {buildSchema} = require('graphql')
// module.exports =buildSchema(`
//     // type  TestData {
//     //     text : String
//     //     views : Int
//     //     }
//     // type RootQuery  {
//     //     hello : TestData
//     // }
//     // schema {
//     //     query : RootQuery
//     // }
// `)
module.exports = buildSchema(`
    type Post {
        _id: ID!
       
    }

    type User {
        _id: ID!
        firstName: String!
        lastName : String!
        email: String!
        password: String!
        role : String!
        posts: [Post!]!
    }

    type AuthData{
        userId : String!
    }

    input UserInputData {
        email: String!
        firstName: String!
        lastName : String!
        password: String!
        role : String!
    }

    type RootQuery {
        login(email:String,password:String): AuthData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);