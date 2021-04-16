import {
  ApolloClient, ApolloLink, InMemoryCache, concat, from
} from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from '@apollo/client/link/error';
import { setCookie, removeCookie, getCookie } from '../utils/cookie';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql'
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Accept: 'application/json',
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    }
  }));

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => console.log(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
    )
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// use with apollo-client
const link = ApolloLink.from([
  errorLink,
  authMiddleware,
  httpLink,
]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
  credentials: 'include',
});
