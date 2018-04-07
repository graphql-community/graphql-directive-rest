# graphql-directive-rest

[![Version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![PRs Welcome][prs-badge]][prs]
[![MIT License][license-badge]][build]

# Introduction

GraphQL is often used to integrate applications with REST API.
Using this directive allows you to make REST integrations without creating any resolvers :tada: :open_mouth:

# Table of Contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#Usage)
* [Parameters](#parameters)
* [Contributing](#contributing)
* [LICENSE](#license)

# Installation

```
yarn add graphql-directive-rest
```

_This package requires [graphql](https://www.npmjs.com/package/graphql) and [graphql-tools](https://www.npmjs.com/package/graphql-tools) as peer dependency_

# Usage

## Standard approach, without the `@rest` directive

```js
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

`;

const resolvers

module.exports = makeExecutableSchema({
  typeDefs,
  schemaDirectives: {
    rest: restDirective,
  },
});
```

## Using `@rest` directive

When using `@rest` directive, we don't need to write any resolvers :tada:

```js
const { makeExecutableSchema } = require('graphql-tools');
const restDirective = require('../index');

const GITHUB_URL = 'https://api.github.com';
const USER_URL = 'https://randomuser.me/api';
const ADMIN_URL = 'https://yesno.wtf';

const typeDefs = `
  type User {
    login: String
    avatar_url: String
  }

  type Me {
    gender: String
    email: String
    admin: String @rest(url: "${ADMIN_URL}/api" extractFromResponse: "answer")
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
```

> Warning! Directive overwrites your resolvers if defined.

## Example queries:

```graphql
query {
  users {
    login
    avatar_url
  }
}
```

```graphql
query($user: String) {
  user(user: $user) {
    login
    avatar_url
  }
}
```

```graphql
query($gender: String) {
  me(gender: $gender) {
    gender
    email
    admin
  }
}
```

# Directive Parameters

Directive params:

### `url`: String _required_

Endpoint from where we want to get the data.

### `extractFromResponse`: String

The path where is the data that we want to get.

Response:

```json
{
  "results": [
    {
      "gender": "male",
      "name": {
        "title": "mr",
        "first": "Elon",
        "last": "ons"
      }
    }
  ]
}
```

Examples of usage `extractFromResponse`

To get the title: `"results[0].name.title"`
or to get the gender: `"results[0].gender"`

## Contributing

I would love to see your contribution. ❤️

For local development (and testing), all you have to do is to run `yarn` and then `yarn dev`. This will start the Apollo server and you are ready to contribute :tada:

Run yarn test (try `--watch` flag) for unit tests (we are using Jest)

# LICENSE

The MIT License (MIT) 2018 - Luke Czyszczonik - <mailto:lukasz.czyszczonik@gmail.com>

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/graphql-community/graphql-directive-rest.svg?style=flat-square
[build]: https://travis-ci.org/graphql-community/graphql-directive-rest
[coverage-badge]: https://img.shields.io/codecov/c/github/graphql-community/graphql-directive-rest.svg?style=flat-square
[coverage]: https://codecov.io/github/graphql-community/graphql-directive-rest
[version-badge]: https://img.shields.io/npm/v/graphql-directive-rest.svg?style=flat-square
[package]: https://www.npmjs.com/package/graphql-directive-rest
[downloads-badge]: https://img.shields.io/npm/dm/graphql-directive-rest.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/graphql-directive-rest
[license-badge]: https://img.shields.io/npm/l/graphql-directive-rest.svg?style=flat-square
[license]: https://github.com/graphql-community/graphql-directive-rest/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/graphql-community/graphql-directive-rest/blob/master/CODE_OF_CONDUCT.md
