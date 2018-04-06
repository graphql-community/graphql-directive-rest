const { makeExecutableSchema } = require('graphql-tools');
const restDirective = require('../index');

const typeDefs = `
  type User {
    login: String
    avatar_url: String
  }

  type Me {
    gender: String
    email: String
    admin: String @rest(url: "https://yesno.wtf/api" extractFromResponse: "answer")
  }

  type Query {
    me(gender: String): Me @rest(url: "https://randomuser.me/api/?gender=$gender" extractFromResponse: "results[0]")
    users: [User] @rest(url: "https://api.github.com/users")
    user(user: String): User @rest(url: "https://api.github.com/users/$user")
  }
`;

module.exports = makeExecutableSchema({
  typeDefs,
  undefined, // we don't need resolvers :) thanks for @rest directive!
  schemaDirectives: {
    rest: restDirective,
  },
});
