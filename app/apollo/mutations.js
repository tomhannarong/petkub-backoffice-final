import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation SIGN_UP($fname: String!, $lname: String!, $email: String!, $password: String!, $passwordConfirm: String!) {
    signup(
      fname: $fname
	    lname: $lname
	    email: $email
      password: $password
      passwordConfirm: $passwordConfirm
    ) {
      userId
      refreshToken
      accessToken
      expiresIn
    }
  }
`;

export const SIGN_IN = gql`
  mutation SIGN_IN($email: String!, $password: String!) {
    signin(
      email: $email
      password: $password
    ){
        userId
        accessToken
        refreshToken
        expiresIn
    }

  }
`;

export const SIGN_OUT = gql`
  mutation {
    signout {
      message
    }
  }
`;
export const REQUEST_TO_RESET_PASSWORD = gql`
  mutation REQUEST_TO_RESET_PASSWORD($email: String!) {
    requestResetPassword(email: $email) {
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation RESET_PASSWORD($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      message
    }
  }
`;

export const UPDATE_ROLES = gql`
  mutation UPDATE_ROLES($userId: String!, $newRoles: [String!]!) {
    updateRoles(userId: $userId, newRoles: $newRoles) {
      id
      username
      email
      roles
      createdAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DELETE_USER($userId: String!) {
    deleteUser(userId: $userId) {
      message
    }
  }
`;

export const CREATE_PETTYPE = gql`
  mutation CREATE_PETTYPE($name: String!) {
    createPetType(name: $name){
      id
      name
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation REFRESH_TOKEN($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      userId
      accessToken
      refreshToken
      expiresIn
    }
  }
`;
