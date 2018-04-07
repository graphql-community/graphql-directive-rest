const { graphql } = require('graphql');
const nock = require('nock');
const directive = require('../index');
const schema = require('../example/schemaWithResolvers');

beforeAll(() => {
  nock.disableNetConnect();
});

afterEach(() => {
  nock.cleanAll();
});

afterAll(() => {
  nock.enableNetConnect();
});

test('getDirectiveDeclaration should be defined', () => {
  expect(directive.getDirectiveDeclaration()).toMatchSnapshot();
});

test('path is return correct result and fillParametersFromArgs replace parameters in url', async () => {
  nock('https://yesno.wtf:443')
    .get('/api')
    .reply(200, { answer: 'yes' });

  nock('https://randomuser.me:443', { encodedQueryParams: true })
    .get('/api/')
    .query({ gender: 'female' })
    .reply(200, {
      results: [{ gender: 'female', email: 'diana.marshall@example.com' }],
    });

  const response = await graphql(
    schema,
    `
      query($gender: String) {
        me(gender: $gender) {
          gender
          email
          admin
        }
      }
    `,
    {},
    {},
    { gender: 'female' }
  );

  expect(response).toMatchSnapshot();
});

test('return plain response', async () => {
  nock('https://api.github.com:443', { encodedQueryParams: true })
    .get('/users')
    .reply(200, [
      { login: 'ejo', avatar_url: 'https://avatar.example' },
      { login: 'ajo', avatar_url: 'https://avatars0.example' },
      { login: 'bojo', avatar_url: 'https://avatars0.example' },
    ]);

  const response = await graphql(
    schema,
    `
      query {
        users {
          login
          avatar_url
        }
      }
    `
  );

  expect(response).toMatchSnapshot();
});

test('if replace url params', async () => {
  nock('https://api.github.com:443', { encodedQueryParams: true })
    .get('/users/ejo')
    .reply(200, {
      login: 'ejo',
      avatar_url: 'https://avatars0.example',
    });

  const response = await graphql(
    schema,
    `
      query($user: String) {
        user(user: $user) {
          login
          avatar_url
        }
      }
    `,
    {},
    {},
    { user: 'ejo' }
  );

  expect(response).toMatchSnapshot();
});
