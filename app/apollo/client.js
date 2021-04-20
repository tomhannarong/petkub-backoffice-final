
import { ApolloClient, ApolloLink, InMemoryCache, fromPromise  } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from '@apollo/client/link/error';
import { setCookie, removeCookie, getCookie } from '../utils/cookie';
import { checkTokenExpired } from './../helpers/tokenHelpers'
import { REFRESH_TOKEN } from './mutations';
import jwt_decode from "jwt-decode";

  let client

  const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql'
  });
  

  const getNewToken = async  () => {
    const _accessToken = getCookie('accessToken')
    const _refreshToken = getCookie('refreshToken')

    const variables = {
      refreshToken: _refreshToken,
    }

    const {
      data: {
        refreshToken: {
          userId, accessToken, refreshToken, expiresIn 
        },
      },
    } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables,
    })

    return {accessToken , refreshToken};
  };  

  const authMiddleware = new ApolloLink((operation, forward) => {
  
    const accessToken = getCookie('accessToken')
    const refreshToken = getCookie('refreshToken')

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
  
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward  }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        
        switch (err.extensions.code) {
          case "UNAUTHENTICATED":
            const _accessToken = getCookie('accessToken')
            const _refreshToken = getCookie('refreshToken')
  
            if(_accessToken && _refreshToken){
              const accessTokenDecoded = jwt_decode(_accessToken);
              const isTokenExpired = checkTokenExpired(accessTokenDecoded ? accessTokenDecoded.exp: 0)

              // Token is expired
              if(isTokenExpired){
                
                return fromPromise(
                  getNewToken()
                    .then(({ accessToken, refreshToken }) => {
                      
                      // Set Cookie in browser
                      setCookie('accessToken', accessToken);
                      setCookie('refreshToken', refreshToken);
                      return accessToken;
                    })
                    .catch(error => {
                      // Handle token refresh errors e.g clear stored tokens, redirect to login, ...
                      //  Remove Cookie in browser
                      removeCookie('accessToken');
                      removeCookie('refreshToken');

                      window.location.href = '/login';
                      return;
                    })
                ).filter(value => Boolean(value))
                  .flatMap((accessToken ) => {
                  const oldHeaders = operation.getContext().headers;
                  // modify the operation context with a new token
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      Accept: 'application/json',
                      authorization: `Bearer ${accessToken}`,
                    },
                  });
                  // retry the request, returning the new observable
                  return forward(operation);
                });
              }
            }
          // case "ARGUMENT_VALIDATION_ERROR":
          //   let Msg = ''
          //   for (let {property, value, constraints} of err.extensions.exception.validationErrors) {
          //     Msg += '  constraints: '
          //     for (let v of Object.values(constraints)) {   
          //       Msg += v + ' \n'
          //     }
          //     Msg += '  property: ' + property + ' \n'
          //     Msg += '  value: ' + value + ' \n'
          //     Msg += '  # # # # \n'    
          //   }
          //   console.log(
          //     '[GraphQL error]: Message: ' + err.message + ' \n' +
          //     'Code: ' + err.extensions.code + ' \n' +
          //     'Path: ' + err.path + ' \n' +
          //     'Validation Errors: \n' + Msg + ' \n' 
          //   ) 

          default: 
          console.log(
            `[GraphQL error]: Message: ${err.message}, Code: ${err.extensions.code}, Path: ${err.path}`
          ) 
        }
      }
      // graphQLErrors.forEach(({ message, locations, path }) => 
      // console.log(
      //   `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      // )
      // );
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });
  
  // use with apollo-client
  const link = ApolloLink.from([
    errorLink,
    authMiddleware,
    httpLink,
  ]);

  const defaultOptions = {
    // watchQuery: {
    //   fetchPolicy: 'cache-and-network',
    //   errorPolicy: 'ignore',
    // },
    // query: {
    //   fetchPolicy: 'network-only',
    //   errorPolicy: 'all',
    // },
    // mutate: {
    //   errorPolicy: 'all',
    // },
  };

  client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    credentials: 'include',
    defaultOptions
  });

  export default client


  
