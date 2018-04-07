const { makeExecutableSchema } = require('graphql-tools');
const restDirective = require('../index');
const fetch = require('node-fetch');

const typeDefs = `
  type User {
    login: String
    avatar_url: String
  }

  type Me {
    gender: String
    email: String
    admin: String 
  }

  type Query {
    me(gender: String): Me
    users: [User]
    user(user: String): User
  }
`;

const resolvers = {
  Query: {
    me: (_, args) =>
      fetch(`https://randomuser.me/api/?gender=${args.gender}`)
        .then(res => res.json())
        .then(data => data.results[0]),
    users: () => fetch('https://api.github.com/users').then(res => res.json()),
    user: (_, args) =>
      fetch(`https://api.github.com/users/${args.user}`).then(res =>
        res.json()
      ),
  },
  Me: {
    admin: () =>
      fetch('https://yesno.wtf/api')
        .then(res => res.json())
        .then(data => data.answer),
  },
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    rest: restDirective,
  },
});
