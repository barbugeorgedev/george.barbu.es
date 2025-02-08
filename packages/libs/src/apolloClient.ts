import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const SANITY_PROJECT_ID = "bet7jatc";
const SANITY_DATASET = "production";
const SANITY_GRAPHQL_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/graphql/${SANITY_DATASET}/default`;

const client = new ApolloClient({
  link: new HttpLink({ uri: SANITY_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});

export default client;
