const { makeExecutableSchema } = require('graphql-tools');
const restDirective = require('../index');

const GITHUB_URL = 'https://api.github.com';
const USER_URL = 'https://randomuser.me/api';
const ADMIN_URL = 'https://yesno.wtf/api';

const typeDefs = `
  type User {
    login: String
    avatar_url: String
  }

  type Me {
    gender: String
    email: String
    admin: String @rest(url: "${ADMIN_URL}" extractFromResponse: "answer")
  }

  type Query {
    me(gender: String): Me @rest(url: "${USER_URL}/?gender=$gender" extractFromResponse: "results[0]")
    users: [User] @rest(url: "${GITHUB_URL}/users")
    user(user: String): User @rest(url: "${GITHUB_URL}/users/$user")
  }
`;

module.exports = makeExecutableSchema({
  typeDefs,
  schemaDirectives: {
    rest: restDirective,
  },
});
