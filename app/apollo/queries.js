import { gql } from '@apollo/client';

export const ME = gql`
  query {
    me {
      id
      email
      personalInformation {
        fname
        lname
      }
      roles
      deletedAt
    }
  }
`;

export const QUERY_USERS = gql`
  query {
    users {
      id
      email
      personalInformation {
        fname
        lname
        birthday
        gender
      }
      contact {
        name
        phone
        facebook
        line
        instagram
      }
      profileImg
      roles
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const QUERY_PEY_TYPES = gql`
  query {
    petTypes {
      id
      name
      createdAt
      deletedAt
      updatedAt
    }
  }
`;

export const QUERY_PEY_BREEDS = gql`
  query {
    petBreeds {
      id
      name
      petType {
        id
        name
      }
      createdAt
      deletedAt
      updatedAt
    }
  }
`;
