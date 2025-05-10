// countriesGraphQL.js

async function getCountry(code) {
  const { GraphQLClient, gql } = await import('graphql-request');

  const apiUrl = 'https://countries.trevorblades.com/';
  const client = new GraphQLClient(apiUrl);

  const getCountryQuery = gql`
    query getCountry($code: ID!) {
      country(code: $code) {
        code
        currency
      }
    }
  `;

  const data = await client.request(getCountryQuery, { code: code.toUpperCase() });
  return data.country;
}

module.exports = { getCountry };
