const {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLString,
} = require('graphql');
const { SchemaDirectiveVisitor } = require('graphql-tools');
const fetch = require('node-fetch');
const get = require('lodash.get');

class RestError extends Error {
  constructor(message = 'Error occured', code = 400) {
    super(message);
    this.code = code;
  }
}

class restDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName = 'rest') {
    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        url: { type: GraphQLString },
        extractFromResponse: { type: GraphQLString, defaultValue: '' },
      },
    });
  }

  visitFieldDefinition(field) {
    field.resolve = (_, args) => {
      let url = this.args.url;

      if (args) {
        for (const arg in args) {
          if (Object.prototype.hasOwnProperty.call(args, arg)) {
            url = url.replace(`$${arg}`, args[arg]);
          }
        }
      }

      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new RestError(response.statusText, response.status);
          }

          return response.json();
        })
        .then(data => {
          if (this.args.extractFromResponse) {
            return get(data, this.args.extractFromResponse);
          }

          return data;
        });
    };
  }
}

module.exports = restDirective;
