import { GraphQLClient } from "graphql-request";

const endpoint = process.env.GRAPHQL_API_ENDPOINT;
export const apiClient = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});
